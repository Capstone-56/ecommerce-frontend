import { ProductModel } from "@/domain/models/ProductModel";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type cartStore = {
    /**
     * An array of selected products to be bought.
     */
    cart: Array<ProductModel>,
    /**
     * A function to insert a selected product into the cart state. 
     * @param addedProduct The selected product to add to the cart.
     * @returns A cart containing the selected product.
     */
    addToCart: (product: ProductModel) => void,
    /**
     * A function to remove a selected product from the cart state.
     * @param removedProduct The selected product to remove from the cart.
     * @returns A cart not containing the selected product.
     */
    removeFromCart: (product: ProductModel) => void
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
            addToCart: (addedProduct: ProductModel) => set(({ cart: [...get().cart, addedProduct]})),
            removeFromCart: (removedProduct: ProductModel) => set((state: any) => ({
                cart: get().cart.filter((cartItem: ProductModel) => cartItem !== removedProduct)
            }))
        }),
        {
            // Name of the item in the storage.
            name: 'cart-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
      ),
)
