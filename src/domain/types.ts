import { ProductModel } from "./models/ProductModel"

/**
 * The type to be casted for the cart state.
 */
export interface cartItem {
  product: ProductModel,
  quantity: number
}
