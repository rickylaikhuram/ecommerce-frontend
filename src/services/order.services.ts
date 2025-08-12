// services/order.service.ts
import type {
  CartCheckoutResponse,
  OrderResponse,
} from "../types/checkout.types";
import type { CreateOrderRequest } from "../types/order.types";
import instance from "../utils/axios";

class OrderService {
  private baseUrl = "/api/user";

  async createUpiQrOrder(
    orderData: CreateOrderRequest,
    onValidationFailed?: (validationData: CartCheckoutResponse) => void
  ): Promise<OrderResponse> {
    try {
      const response = await instance.post(
        `${this.baseUrl}/create-order/upi-qr`,
        orderData
      );
      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorCode = error.response.data?.code;
        const errorMessage = error.response.data?.message;

        // Handle cart validation failure specifically
        if (errorCode === "CART_VALIDATION_FAILED") {
          // If validation data is provided in the error response, use it
          const validationData = error.response.data?.validationData;
          if (validationData && onValidationFailed) {
            onValidationFailed(validationData);
          }
          throw new Error("CART_VALIDATION_FAILED");
        }

        throw new Error(errorMessage || "Invalid order data");
      }
      if (error.response?.status === 401) {
        throw new Error("Authentication required");
      }
      if (error.response?.status === 422) {
        throw new Error("Validation failed");
      }
      throw new Error(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }

  async getOrderDetails(
    orderId: string
  ): Promise<{ success: boolean; order: any }> {
    const response = await instance.get(`${this.baseUrl}/${orderId}`);
    return response.data;
  }

  async getOrderHistory(): Promise<{ success: boolean; orders: any[] }> {
    const response = await instance.get(`${this.baseUrl}/history`);
    return response.data;
  }

  async cancelOrder(
    orderId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await instance.patch(`${this.baseUrl}/${orderId}/cancel`);
    return response.data;
  }

  async verifyPayment(
    orderId: string
  ): Promise<{ success: boolean; paymentStatus: string }> {
    const response = await instance.post(
      `${this.baseUrl}/${orderId}/verify-payment`
    );
    return response.data;
  }
}

export const orderService = new OrderService();
