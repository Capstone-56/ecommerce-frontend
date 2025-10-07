// Corresponding backend model: ProductModel.py

export interface ProductModel {
  id: string,
  name: string,
  description: string,
  images: Array<string> | null,
  featured: boolean,
  avgRating: number,
  price: number,
  currency: string,
  variations: {
    [variationType: string]: string[];
  },
  category: string,
  locations: Array<string>
};
