// types/order.types.ts
interface OrderItem {
  id: string;
  productId: string | null;
  stockName: string;
  quantity: number;
  price: number;
  productName: string;
  productDescription: string | null;
  productImageUrl: string | null;
  productCategory: string | null;
}

interface Payment {
  status: string;
  method: string;
}

// used in order details and order confirmation page
export interface OrderDetails {
  id: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingZipCode: string;
  orderItems: OrderItem[];
  payment: Payment | null;
}

export interface OrderItemPartial {
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

// used in order service
export interface CreateOrderRequest {
  productDatas: OrderItemPartial[];
  address: ShippingAddress;
  paymentMethod: string;
  specialInstructions?: string;
}
