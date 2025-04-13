import api from "@/api";

import { ProductModel } from "@/models/ProductModel";

export class ProductService {
  /**
   * An endpoint to retrieve all products stored in the database.
   * @returns A list of products.
   */
  async listProducts() : Promise<Array<ProductModel>> {
    try {
      const products = await api.get("/api/product");
      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getProduct(productId: string) : Promise<ProductModel> {
    return Promise.reject();
  }
}
