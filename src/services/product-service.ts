import api from "@/api";

import { ProductModel } from "@/domain/models/ProductModel";

export class ProductService {
  async listProducts() : Promise<Array<ProductModel>> {
    return Promise.reject();
  }

  async getProduct(productId: string) : Promise<ProductModel> {
    return Promise.reject();
  }
}
