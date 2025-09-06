import { UUID } from "crypto"
import { OrderStatus } from "../enum/orderStatus"

// Total order model.
export interface TotalOrderModel {
  totalSales: number,
  orderCount: number
}

// Product model of a particular order.
export interface OrderProductModel {
  id: string,
  name: string,
  description: string,
  images: Array<string>,
  featured: boolean,
  avgRating: number,
  price: number,
  category: string,
  locations: [],
  variations: JSON,
  total_quantity_purchased: number,
  total_items_sold: number
}

// Singular order model.
export interface OrderModel {
  id: string,
  createdAt: string,
  user: string | null,
  guestUser: JSON,
  address: UUID,
  shippingVendor: number,
  totalPrice: number,
  status: OrderStatus
  items: []
}

// Weekly order model.
export interface TotalWeeklyOrders {
  date: string,
  total_sales: number
}