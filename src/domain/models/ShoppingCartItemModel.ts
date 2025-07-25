import { UserModel } from "./UserModel";
import { ProductItemModel } from "./ProductItemModel";

export interface ShoppingCartItemModel {
  readonly id: string;
  user: UserModel;
  productItem: ProductItemModel;
  quantity: number;
}

export type AddShoppingCartItemModel = Omit<ShoppingCartItemModel, "id" | "user" | "productItem"> & {
  productItemId: string;
}

export type UpdateShoppingCartItemModel = Omit<ShoppingCartItemModel, "id" | "user" | "productItem">;
