import api from "@/api";

import { ProductItemModel } from "@/domain/models/ProductItemModel";

export class ProductItemService {
  /**
   * Retrieves all product items for a given product ID.
   * @param productId The ID of the product to retrieve items for.
   * @returns An array of ProductItemModel objects.
   */
  async getByProductId(productId: string): Promise<Array<ProductItemModel>> {
    try {
      const response = await api.get(`/api/productItem/${productId}/byProduct`);

      return response.data;
    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }

  /**
   * Retrieves the product item id that matches the given configurations.
   * @param productId The ID of the product to retrieve items for.
   * @param variantIds An array of variant IDs to match.
   * @returns The matching product item id.
   */
  async retrieveByConfigurations(productId: string, variantIds: Array<string>): Promise<number> {
    try {
      const model = {
        variantIds: variantIds,
      };

      const response = await api.post(`/api/productItem/${productId}/retrieveByConfigurations`, model);

      return response.data;
    } catch (error) {
      console.error("Error retrieving product item by configurations:", error);
      throw error;
    }
  }

  /**
   * An endpoint to retrieve a set of related product items.
   * @param productId The ID of the product to get related product items for.
   * @returns A set of product items.
   */
  async getProductItems(productId: string): Promise<ProductItemModel[]> {
    try {
      const baseUrl = `/api/productItem/${productId}/byProduct`;
      const productItems = await api.get(baseUrl);

      return productItems.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
  * An endpoint to create a product item.
  * @param payload A JSON object containing the appropriate fields to create
  *                a new product item.
  * @returns A HTTP status.
  */
  async createProductItem(payload: object): Promise<number> {
    try {
      const baseUrl = `/api/productItem`;

      const productItems = await api.post(baseUrl, payload);

      return productItems.status;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
  * An endpoint to remove a particular product item.
  * @param productItemId The ID of a product item to be removed.
  * @returns A HTTP status.
  */
  async removeProductItem(productItemId: string): Promise<number> {
    try {
      const baseUrl = `/api/productItem/${productItemId}/delete`;

      const productItems = await api.post(baseUrl);

      return productItems.status;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
