import api from "@/api";

import { PagedList } from "@/domain/abstract-models/PagedList";
import { ProductModel } from "@/domain/models/ProductModel";

export class ProductService {
  /**
   * An endpoint to retrieve all products stored in the database.
   * @returns A paged result of products.
   */
  async listProducts(
    page?      : number,
    page_size? : number,
  ) : Promise<PagedList<ProductModel>> {
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (page_size) params.append("page_size", page_size.toString());

      const baseUrl = `/api/product?${params.toString()}`;

      const products = await api.get(baseUrl);
      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getProduct(productId: string) : Promise<ProductModel> {
    return Promise.reject();
  }
}
