// types/order.types.ts
export interface OrderDetailsResponse {
  success: boolean;
  order: {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: ShippingAddress;
    paymentStatus: "pending" | "completed" | "failed" | "cancelled";
    orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
    paymentMethod: string;
    paymentUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrderItem {
  productId: string;
  productVarient: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
export interface CreateOrderRequest {
  productDatas: OrderItem[];
  address: ShippingAddress;
  paymentMethod: string;
  specialInstructions?: string;
}
