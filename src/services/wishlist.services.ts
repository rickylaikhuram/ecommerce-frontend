import type { ProductResponse } from "../types/products.types";
import type { WishlistIdsResponse, WishlistResponse } from "../types/wishlist.types";
import instance from "../utils/axios";

export const wishlistService = {
  // Toggle wishlist for a product
  async toggleWishlist(productId: string): Promise<{ removed: boolean }> {
    try {
      const response = await instance.post<{ removed: boolean }>(
        `/api/user/wishlist/toggle/${productId}`
      );
      return response.data; // { removed: true } or { removed: false }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      throw error;
    }
  },

  // Get all wishlist products for logged-in user
  async getUserWishlistedIds(): Promise<WishlistIdsResponse> {
    try {
      const response = await instance.get<WishlistIdsResponse>("/api/user/wishlist/ids");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },

  // Get all wishlist products for logged-in user
  async getUserWishlist(): Promise<WishlistResponse> {
    try {
      const response = await instance.get<WishlistResponse>("/api/user/wishlist");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },
};
