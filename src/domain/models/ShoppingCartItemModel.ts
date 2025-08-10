import { UserModel } from "./UserModel";
import { ProductItemModel } from "./ProductItemModel";

export interface ShoppingCartItemModel {
  readonly id: string;
  user: UserModel;
  productItem: ProductItemModel;
  quantity: number;
  readonly totalPrice: number;
}

/** ShoppingCartItemModel for state management. */
export interface LocalShoppingCartItemModel {
  id: string;
  productItem: ProductItemModel;
  quantity: number;
  totalPrice: number;
}

export type AddShoppingCartItemModel = Omit<ShoppingCartItemModel, "id" | "user" | "productItem" | "totalPrice"> & {
  productItemId: string;
}

export type UpdateShoppingCartItemModel = Omit<ShoppingCartItemModel, "id" | "user" | "productItem" | "totalPrice">;
