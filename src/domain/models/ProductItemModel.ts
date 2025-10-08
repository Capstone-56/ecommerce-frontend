import { ProductModel } from "./ProductModel";

export interface ProductItemModel {
  readonly id: string;
  product: ProductModel;
  sku: string;
  stock: number;
  price: number;
  currency: string; // Changed from CurrencyModel to string
}
