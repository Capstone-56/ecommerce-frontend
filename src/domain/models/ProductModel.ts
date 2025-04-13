// Corresponding backend model: ProductModel.py

export interface ProductModel {
  id: string,
  name: string,
  description: string,
  images: Array<string> | null,
};
