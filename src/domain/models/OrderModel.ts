import { ProductItemModel } from "./ProductItemModel";
import { UserModel } from "./UserModel";

export interface OrderItemModel {
  readonly id: string;
  productItem: ProductItemModel;
  quantity: number;
  price: number;
}

export interface AddressModel {
  addressLine: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

export interface ShippingVendorModel {
  readonly id: number;
  name: string;
  logoUrl: string;
  isActive: boolean;
}

export interface GuestUserModel {
  readonly id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OrderModel {
  readonly id: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  items: OrderItemModel[];
  user?: UserModel;
  guestUser?: GuestUserModel;
}

export type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderStatusModel {
  status: PaymentStatus;
  orderId?: string;
  amount?: number;
  currency?: string;
  reason?: string;
  order?: OrderModel;
  address?: AddressModel;
  shippingVendor?: ShippingVendorModel;
}