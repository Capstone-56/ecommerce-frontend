export interface Product {
    id: string;
    name: string;
    price: number;
    brand?: string;
    category: string;
    thumbnail?: string;
    inStock: boolean;
  }