import { ProductModel } from "@/domain/models/ProductModel";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Constants } from "./constants";
import { cartItem } from "./types";
import { Role } from "./enum/role";

type cartStore = {
  /**
   * An array of selected products to be bought.
   */
  cart: Array<cartItem>;
  /**
   * A function to insert a selected product into the cart state.
   * @param addedProduct The selected product to add to the cart.
   * @returns A cart containing the selected product.
   */
  addToCart: (addedProduct: ProductModel, quantity: number) => void;
  /**
   * A function to remove a selected product from the cart state.
   * @param removedProduct The selected product to remove from the cart.
   * @returns A cart not containing the selected product.
   */
  removeFromCart: (removedProduct: ProductModel) => void;
  /**
   * A function to update the quantity of a product stored in cart.
   * @param product The selected product to have its quantity updated.
   * @param amount  The amount to change its quantity by.
   * @returns A cart with the updated product's quantity.
   */
  updateQuantity: (product: ProductModel, amount: number) => void;
  /**
   * A function to retrieve the quantity of a certain product.
   * @param product The product to retrieve a quantity for.
   * @returns The quantity if found.
   */
  getQuantity: (product: ProductModel) => number | undefined;
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
   * Sets the users location.
   * @param location The location of user to be set.
   */
  setLocation: (location: string) => void;
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
      addToCart: (addedProduct: ProductModel, quantity: number) => {
        if (get().cart.some((cartItem) => cartItem.product.id === addedProduct.id)) {
          get().updateQuantity(addedProduct, quantity)
        } else {
          set({
            cart: [...get().cart, { product: addedProduct, quantity: quantity }],
          })
        }
      },
      removeFromCart: (removedProduct: ProductModel) =>
        set((state: any) => ({
          cart: get().cart.filter(
            (cartItem: cartItem) => cartItem.product !== removedProduct
          ),
        })),
      updateQuantity: (product: ProductModel, amount: number) =>
        set((state: any) => ({
          cart: get().cart.map((currentProduct: cartItem) =>
            currentProduct.product.id === product.id
              ? {
                ...currentProduct,
                quantity: (currentProduct.quantity += amount),
              }
              : currentProduct
          ),
        })),
      getQuantity: (product: ProductModel) => {
        const cartItem = get().cart.find((item) => item.product === product);
        return cartItem?.quantity;
      },
    }),
    {
      // Name of the item in the storage.
      name: Constants.LOCAL_STORAGE_CART_STORAGE,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Authentication global state to store user's authentication state. Is required to check on client side where user is authenticated.
 */
export const AuthenticationState = create<AuthenticationStore>()(
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
export const UserState = create<UserStore>()(
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
 * Location state to store the user's active location. Will be used to get
 * products that are available in the user's country.
 */
export const locationState = create<LocationStore>()(
  persist(
    (set) => ({
      userLocation: null,
      setLocation: (userLocation: string) => set({ userLocation }),
    }),
    {
      name: Constants.LOCAL_STORAGE_LOCATION_STORAGE,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
