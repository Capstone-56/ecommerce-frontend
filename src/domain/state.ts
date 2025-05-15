import { ProductModel } from "@/domain/models/ProductModel";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Constants } from "./constants";
import { cartItem } from "./types";

type cartStore = {
    /**
     * An array of selected products to be bought.
     */
    cart: Array<cartItem>,
    /**
     * A function to insert a selected product into the cart state. 
     * @param addedProduct The selected product to add to the cart.
     * @returns A cart containing the selected product.
     */
    addToCart: (addedProduct: ProductModel) => void,
    /**
     * A function to remove a selected product from the cart state.
     * @param removedProduct The selected product to remove from the cart.
     * @returns A cart not containing the selected product.
     */
    removeFromCart: (removedProduct: ProductModel) => void,
    /**
     * A function to update the quantity of a product stored in cart.
     * @param product The selected product to have its quantity updated.
     * @param amount  The amount to change its quantity by.
     * @returns A cart with the updated product's quantity.
     */
    updateQuantity: (product: ProductModel, amount: number) => void,
    /**
     * A function to retrieve the quantity of a certain product.
     * @param product The product to retrieve a quantity for.
     * @returns The quantity if found.
     */
    getQuantity: (product: ProductModel) => number | undefined
}

type JWTStore = {
    /**
     * User's access token.
     */
    accessToken: string | null,
    /**
     * User's refresh token.
     */
    refreshToken: string | null,
    /**
     * A function to set both refresh and access token after logging in.
     * @param accessToken  The access token to save in state.
     * @param refreshToken The refresh token to save in state.
     */
    setTokens: (accessToken: string, refreshToken: string) => void,
    /**
     * A function to set only an access token when refreshed through the interceptor.
     * @param accessToken The access token to be set.
     */
    setAccessToken: (accessToken: string) => void,
    /**
     * A function to clear both tokens stored in state. Required for when a user's tokens
     * are expired and needs to be logged out.
     */
    clearTokens: () => void
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
            addToCart: (addedProduct: ProductModel) => set(({ cart: [...get().cart, {product: addedProduct, quantity: 1}]})),
            removeFromCart: (removedProduct: ProductModel) => set((state: any) => ({
                cart: get().cart.filter((cartItem: cartItem) => cartItem.product !== removedProduct)
            })),
            updateQuantity: (product: ProductModel, amount: number) => set((state: any) => ({
                cart: get().cart.map((currentProduct: cartItem) => currentProduct.product === product ? 
                { ...currentProduct, quantity: currentProduct.quantity += amount} : currentProduct)
            })),
            getQuantity: (product: ProductModel) => {
                const cartItem = get().cart.find(item => item.product === product);
                return cartItem?.quantity;
            },
        }),
        {
            // Name of the item in the storage.
            name: Constants.LOCAL_STORAGE_CART_STORAGE,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

/**
 * JWT global state to store user's tokens. Is required to be used within interceptors
 * to hit endpoints that need verification and to assess a user's permissions.
 */
export const JWTState = create<JWTStore>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            setTokens: (accessToken: string, refreshToken: string) => set({accessToken, refreshToken}),
            setAccessToken: (accessToken: string) => set({accessToken}),
            clearTokens: () => set({ accessToken: null, refreshToken: null}),
        }),
        {
            // Name of the item in the storage.
            name: Constants.LOCAL_STORAGE_JWT_STORAGE,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
