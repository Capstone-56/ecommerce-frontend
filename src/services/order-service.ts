import api from "@/api";
import { OrderStatus } from "@/domain/enum/orderStatus";
import { OrderModel, OrderProductModel, OrderStatusModel, TotalOrderModel, TotalWeeklyOrders } from "@/domain/models/OrderModel";
import { toast } from "react-toastify";

export class OrderService {
  /**
   * Retrieves total sales for the past week.
   * @returns The total sales figure and number of sales.
   */
  async getTotalSales(): Promise<TotalOrderModel> {
    try {
      const response = await api.get("/api/order/totalSales");

      return response.data;
    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }

  /**
   * Retrieves the past weeks sales figures. Returns the number of sales
   * per day for the last week.
   * @returns An array of last weeks orders.
   */
  async getPastWeekSaleFigures(): Promise<TotalWeeklyOrders[]> {
    try {
      const response = await api.get("/api/order/weekly/sales");

      return response.data;
    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }

  /**
   * Retrieves the most purchased products to date.
   * @param numberOfItems The number of most purchased items to be returned.
   * @returns An array of OrderProductModel.
   */
  async getMostPurchasedProducts(options?: { limit?: number }): Promise<OrderProductModel[]> {
    try {
      const response = await api.get("/api/orderItem/mostPurchasedProducts", {
        params: options,
      });

      return response.data;
    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }

  /**
   * Retrieves the latest orders.
   * @param options Optional query parameters to filter for latest orders.
   * @returns An array of OrderModel objects.
   */
  async getLatestOrders(options?: {
    userName?: string,
    shippingAddress?: string,
    shippingVendors?: string,
    status?: OrderStatus,
    page?: number,
    pageSize?: number
  }): Promise<OrderModel[]> {
    try {
      const response = await api.get("/api/order", {
        params: options,
      });
      return response.data.results;

    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }

  /**
   * Gets the STRIPE details of a particular payment Intent.
   * @returns The order status model containing STRIPE details..
   */
  async getStripeDetails(paymentIntent: string): Promise<OrderStatusModel> {
    try {
      const response = await api.get("/api/orderstatus", {
        params:
          { pi: paymentIntent }
      });

      return response.data;
    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }

  /**
   * Updates an orders status. From processing to delivered and so forth.
   */
  async updateOrderStatus(requestBody: object): Promise<{ message: string }> {
    try {
      const response = await api.post("/api/order/update", requestBody);

      console.log(response)
      toast.success(response.data.message)
      return response.data;
    } catch (error) {
      console.error("Error getting product item by product id:", error);
      throw error;
    }
  }
}
