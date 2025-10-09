import { OrderItemModel } from "./OrderItemModel";
import { AddressModel } from "./AddressModel";
import { GuestUserModel } from "./GuestUserModel";
import { UserModel } from "./UserModel";

import { OrderStatus } from "../enum/orderStatus";
import { PaymentStatus } from "../type/paymentStatus";

// Total order model.
export interface TotalOrderModel {
  totalSales: number;
  orderCount: number;
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
  id: string;
  createdAt: string;
  user: UserModel | null;
  guestUser: GuestUserModel;
  address: AddressModel;
  totalPrice: number;
  status: OrderStatus;
  items: Array<OrderItemModel>;
  paymentIntentId: string
}

export interface OrderStatusModel {
  status: PaymentStatus;
  orderId?: string;
  amount?: number;
  currency?: string;
  reason?: string;
  order?: {
    readonly id: string;
    createdAt: string;
    totalPrice: number;
    status: string;
    items: OrderItemModel[];
    user?: UserModel;
    guestUser?: GuestUserModel;
  };
  address?: AddressModel;
}

// Weekly order model.
export interface TotalWeeklyOrders {
  date: string;
  total_sales: number;
}
