import { ProductItemModel } from "./ProductItemModel";

export interface OrderItemModel {
  readonly id: string;
  productItem: ProductItemModel;
  quantity: number;
  price: number;
}