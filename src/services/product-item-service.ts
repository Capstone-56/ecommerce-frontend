import api from "@/api";

import { ProductItemModel } from "@/domain/models/ProductItemModel";

export class ProductItemService {
  /**
   * Retrieves all product items for a given product ID.
   * @param productId The ID of the product to retrieve items for.
   * @param userLocation User's location for filtering product items.
   * @param currency User's preferred currency for pricing.
   * @returns An array of ProductItemModel objects.
   */
  async getByProductId(
    productId: string, 
    userLocation?: string | null, 
    currency?: string | null
  ): Promise<Array<ProductItemModel>> {
    try {
      const params = new URLSearchParams();
      if (userLocation) params.append("location", userLocation);
      if (currency) params.append("currency", currency);

      const queryString = params.toString();
      const url = `/api/productItem/${productId}/byProduct${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);

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
   * @param userLocation User's location for filtering product items.
   * @param currency User's preferred currency for pricing.
   * @returns The matching product item id.
   */
  async retrieveByConfigurations(
    productId: string, 
    variantIds: Array<string>,
    userLocation?: string | null,
    currency?: string | null
  ): Promise<number> {
    try {
      const model = {
        variantIds: variantIds,
      };

      const params = new URLSearchParams();
      if (userLocation) params.append("location", userLocation);
      if (currency) params.append("currency", currency);

      const queryString = params.toString();
      const url = `/api/productItem/${productId}/retrieveByConfigurations${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.post(url, model);

      return response.data;
    } catch (error) {
      console.error("Error retrieving product item by configurations:", error);
      throw error;
    }
  }

  /**
   * Retrieves a single product item by its ID.
   * @param productItemId The ID of the product item to retrieve.
   * @param userLocation User's location for filtering product items.
   * @param currency User's preferred currency for pricing.
   * @returns A ProductItemModel object.
   */
  async getProductItemById(
    productItemId: string,
    userLocation?: string | null,
    currency?: string | null
  ): Promise<ProductItemModel> {
    try {
      const params = new URLSearchParams();
      if (userLocation) params.append("location", userLocation);
      if (currency) params.append("currency", currency);

      const queryString = params.toString();
      const url = `/api/productItem/${productItemId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);

      return response.data;
    } catch (error) {
      console.error("Error getting product item by id:", error);
      throw error;
    }
  }
}
