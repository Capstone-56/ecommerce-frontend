import { ProductModel } from "./ProductModel";

export interface ProductItemModel {
  readonly id: string;
  product: ProductModel;
  location: string;
  sku: string;
  stock: number;
  price: number;
}
