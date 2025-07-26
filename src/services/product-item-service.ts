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
}
