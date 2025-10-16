// Corresponding backend model: ProductModel.py

export interface LocationPricing {
  country_code: string;
  price: number;
  discount?: number;
}

export interface ProductModel {
  id: string,
  name: string,
  description: string,
  images: Array<string> | null,
  featured: boolean,
  avgRating: number,
  price: number,
  location_pricing: LocationPricing[],
  currency: string,
  variations: {
    [variationType: string]: string[];
  },
  category: string,
};
