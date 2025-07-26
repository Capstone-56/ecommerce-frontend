import api from "@/api";

import { ProductItemModel } from "@/domain/models/ProductItemModel";

export class ProductItemService {
  async getByProductId(productId: string): Promise<Array<ProductItemModel>> {
    try {
      const response = await api.get(`/api/productItem/${productId}/byProduct`);

      return response.data;
    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }

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
