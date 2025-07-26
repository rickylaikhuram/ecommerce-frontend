// services/cart.service.ts
import type { CartResponse, AddToCartResponse } from '../types/cart.types';
import instance from '../utils/axios';

class CartService {
  private baseUrl = '/api/user/cart';

  async getCart(): Promise<CartResponse> {
    const response = await instance.get(this.baseUrl);
    return response.data;
  }

  async getCartCount(): Promise<{ count: number }> {
    const response = await instance.get(`${this.baseUrl}/count`);
    return response.data;
  }

  async addToCart(
    productId: string,
    stockName: string,
    quantity: number = 1
  ): Promise<AddToCartResponse> {
    const response = await instance.post(`${this.baseUrl}/add`, {
      productId,
      stockName,
      quantity,
    });
    return response.data;
  }

  async updateQuantity(cartItemId: string, quantity: number): Promise<CartResponse> {
    const response = await instance.patch(`${this.baseUrl}/update/${cartItemId}`, {
      quantity,
    });
    return response.data;
  }

  async removeFromCart(cartItemId: string): Promise<CartResponse> {
    const response = await instance.delete(`${this.baseUrl}/remove/${cartItemId}`);
    return response.data;
  }

  async clearCart(): Promise<CartResponse> {
    const response = await instance.delete(`${this.baseUrl}/clear`);
    return response.data;
  }

  async checkProductsInCart(productIds: string[]): Promise<Record<string, any>> {
    const response = await instance.post(`${this.baseUrl}/check-products`, {
      productIds,
    });
    return response.data;
  }
}

export const cartService = new CartService();
