import api from "@/api";

import { PagedList } from "@/domain/abstract-models/PagedList";
import { ProductModel } from "@/domain/models/ProductModel";

export class ProductService {
  /**
   * An endpoint to retrieve products stored in the database.
   * @param page     The page number to retrieve.
   * @param pageSize Size of the page / number of products to be returned.
   * @returns A paged result of products.
   */
  async listProducts(
    page?: number,
    pageSize?: number,
  ) : Promise<PagedList<ProductModel>> {
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (pageSize) params.append("page_size", pageSize.toString());

      const baseUrl = `/api/product?${params.toString()}`;

      const products = await api.get(baseUrl);
      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to retrieve a particular product based on an ID.
   * @param productId An ID of a product to be retrieved.
   * @returns A product's related information.
   */
  async getProduct(productId: string): Promise<ProductModel> {
    try {
      const baseUrl = `/api/product/${productId}`;
      const products = await api.get(baseUrl);
      
      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * An endpoint to retrieve a set of featured products.
   * @returns A set of featured products.
   */
  async getFeaturedProducts(): Promise<ProductModel[]> {
    try {
      const baseUrl = `/api/product/featured`;
      const products = await api.get(baseUrl);
      
      return products.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
