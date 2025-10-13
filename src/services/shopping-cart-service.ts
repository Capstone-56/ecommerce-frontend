import api from "@/api";

import { ShoppingCartItemModel, AddShoppingCartItemModel, UpdateShoppingCartItemModel } from "@/domain/models/ShoppingCartItemModel";


export class ShoppingCartService {
  /**
   * GET /api/cart
   * @returns list of ShoppingCartItemModel of current user
   */
  async getShoppingCart(location: string): Promise<Array<ShoppingCartItemModel>> {
    try {
      const response = await api.get("/api/cart", {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error("Error getting shopping cart:", error);
      throw error;
    }
  }

  /**
   * POST /api/cart
   * @params model (AddShoppingCartItemModel)
   * @returns ShoppingCartItemModel
   */
  async addToCart(model: AddShoppingCartItemModel, location: string): Promise<ShoppingCartItemModel> {
    try {
      const response = await api.post("/api/cart", model, {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  /**
   * PUT /api/cart
   * @params model (UpdateShoppingCartItemModel)
   * @returns ShoppingCartItemModel
   */
  async updateShoppingCartItem(id: string, model: UpdateShoppingCartItemModel, location: string): Promise<ShoppingCartItemModel> {
    try {
      const response = await api.put(`/api/cart/${id}`, model, {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating shopping cart item:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/cart/${id}
   * @params id (ShoppingCartItemModel.id)
   * @returns void
   */
  async removeFromCart(id: string) {
    try {
      const response = await api.delete(`/api/cart/${id}`);

      return response.status;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }
}
