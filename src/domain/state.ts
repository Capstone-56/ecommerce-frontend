import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Constants } from "./constants";
import { LocalShoppingCartItemModel } from "./models/ShoppingCartItemModel";
import { Role } from "./enum/role";
import { COUNTRY_CURRENCY_MAP } from "./enum/currency";

type cartStore = {
  /**
   * An array of selected products to be bought (for both authenticated and unauthenticated users).
   */
  cart: Array<LocalShoppingCartItemModel>;

  /**
   * A function to insert a selected cart item into the cart state.
   * @param cartItem The cart item to add to the cart.
   * @returns A cart containing the selected item.
   */
  addToCart: (cartItem: LocalShoppingCartItemModel) => void;

  /**
   * A function to remove a cart item by its ID.
   * @param cartItemId The cart item ID to remove from the cart.
   * @returns A cart not containing the selected item.
   */
  removeFromCart: (cartItemId: string) => void;

  /**
   * A function to update a specific cart item.
   * @param cartItemId The cart item ID to update.
   * @param updates Partial updates to apply to the cart item.
   * @returns A cart with the updated item.
   */
  updateCartItem: (cartItemId: string, updates: Partial<LocalShoppingCartItemModel>) => void;

  /**
   * A function to set the entire cart (for authenticated users loading from API).
   * @param cartItems The complete cart array to set.
   */
  setCart: (cartItems: Array<LocalShoppingCartItemModel>) => void;

  /**
   * A function to clear all cart items.
   */
  clearCart: () => void;
  
  /**
   * A function to get a cart item by ID.
   * @param cartItemId The cart item ID to find.
   * @returns The cart item if found.
   */
  getCartItem: (cartItemId: string) => LocalShoppingCartItemModel | undefined;
};

type AuthenticationStore = {
  /**
   * User authenticated state.
   */
  authenticated: boolean;

  /**
   * A function to set the authenticated state.
   * @param authenticated The authenticated state to be set.
   */
  setAuthenticated: (authenticated: boolean) => void;
};

type UserStore = {
  /**
   * The user's role.
   */
  role: Role;
  /**
   * The user's username.
   */
  userName: string | null;
  /**
   * A function to set the user's role.
   * @param role The role to be set.
   */
  setRole: (role: Role) => void;
  /**
   * A function to set the user's username.
   */
  setUserName: (userName: string) => void;
}

type LocationStore = {
  /**
   * User's country of origin.
   */
  userLocation: string | null;
  /**
   * User's currency based on their location.
   */
  userCurrency: string | null;
  /**
   * User's selected currency for display (can be different from location-based currency).
   */
  selectedCurrency: string | null;
  /**
   * Sets the users location and automatically updates currency.
   * @param location The location of user to be set.
   */
  setLocation: (location: string) => void;
  /**
   * Sets the user's selected currency for price display.
   * @param currency The currency code to be set.
   */
  setSelectedCurrency: (currency: string) => void;
  /**
   * Gets the effective currency to use (selected currency or user currency).
   */
  getUserCurrency: () => string | null;
}

/**
 * Cart global state to be used for non-registered users. Since non-registered
 * users won't have any related information stored in the DB, having it
 * saved in state will allow those users to navigate the website without losing
 * their selected products.
 */
export const cartState = create<cartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (cartItem: LocalShoppingCartItemModel) => {
        // Check if product already exists in cart by product item ID
        const existingItem = get().cart.find(item => 
          item.productItem.id === cartItem.productItem.id
        );

        if (existingItem) {
          // Update quantity of existing item
          set((state) => ({
            cart: state.cart.map(item => 
              item.productItem.id === cartItem.productItem.id 
                ? {
                    ...existingItem, // Keep existing item's ID
                    quantity: item.quantity + cartItem.quantity,
                    totalPrice: item.productItem.price * (item.quantity + cartItem.quantity)
                  }
                : item
            )
          }));
        } else {
          // Add new item with the provided ID
          set((state) => ({
            cart: [...state.cart, cartItem]
          }));
        }
      },

      removeFromCart: (cartItemId: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        })),

      updateCartItem: (cartItemId: string, updates: Partial<LocalShoppingCartItemModel>) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === cartItemId
              ? {
                  ...item,
                  ...updates,
                  // Recalculate totalPrice if quantity is updated
                  totalPrice: updates.quantity !== undefined
                    ? item.productItem.price * updates.quantity
                    : item.totalPrice
                }
              : item
          ),
        })),

      setCart: (cartItems: Array<LocalShoppingCartItemModel>) =>
        set({ cart: cartItems }),

      clearCart: () => set({ cart: [] }),
      
      getCartItem: (cartItemId: string) => {
        return get().cart.find((item) => item.id === cartItemId);
      },
    }),
    {
      name: Constants.LOCAL_STORAGE_CART_STORAGE,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Add cross-tab synchronisation
if (typeof window !== "undefined") {
  window.addEventListener("storage", e => {
    // Only react to cart storage changes
    if (e.key === Constants.LOCAL_STORAGE_CART_STORAGE) {
      // Force rehydration of the store
      cartState.persist.rehydrate();
    }
  });
}

/**
 * Authentication global state to store user's authentication state. Is required to check on client side where user is authenticated.
 */
export const authenticationState = create<AuthenticationStore>()(
  persist(
    (set) => ({
      authenticated: false,
      setAuthenticated: (authenticated: boolean) => set({ authenticated }),
    }),
    {
      // Name of the item in the storage.
      name: Constants.LOCAL_STORAGE_AUTHENTICATION_STORAGE,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * User state to store the user's role.
 */
export const userState = create<UserStore>()(
  persist(
    (set) => ({
      role: Role.CUSTOMER,
      userName: null,
      setRole: (role: Role) => set({ role }),
      setUserName: (userName: string) => set({ userName })
    }),
    {
      name: Constants.LOCAL_STORAGE_USER_STORAGE,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Location state to store the user's active location and currency. Will be used to get
 * products that are available in the user's country and display prices in their currency.
 */
export const locationState = create<LocationStore>()(
  persist(
    (set, get) => ({
      userLocation: null,
      userCurrency: null,
      selectedCurrency: null,
      setLocation: (userLocation: string) => {
        const userCurrency = COUNTRY_CURRENCY_MAP[userLocation] || null;
        set({ userLocation, userCurrency });
      },
      setSelectedCurrency: (selectedCurrency: string) => {
        set({ selectedCurrency });
      },
      getUserCurrency: () => {
        return get().selectedCurrency || get().userCurrency;
      },
    }),
    {
      name: Constants.LOCAL_STORAGE_LOCATION_STORAGE,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
