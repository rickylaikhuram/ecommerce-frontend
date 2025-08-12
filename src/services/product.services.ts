import type {  CategoryResponse, ProductFilters, ProductResponse } from "../types/products.types";
import instance from "../utils/axios";

// Main service function
export const productService = {

  // get categories
  async getCategories(): Promise<CategoryResponse> {
    try {
      const response = await instance.get<CategoryResponse>("/api/product/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get filtered products
  async getFilteredProducts(
    filters: ProductFilters = {}
  ): Promise<ProductResponse> {
    try {
      const response = await instance.get<ProductResponse>("/api/product", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Convenience methods for common use cases

  // Search products
  async searchProducts(
    searchTerm: string,
    limit?: number
  ): Promise<ProductResponse> {
    return this.getFilteredProducts({ search: searchTerm, limit });
  },

  // Get products by category
  async getProductsByCategory(
    category: string,
    sortBy?: ProductFilters["sortBy"],
    limit?: number
  ): Promise<ProductResponse> {
    return this.getFilteredProducts({ category, sortBy, limit });
  },

  // Get bestsellers
  async getBestsellers(
    period: ProductFilters["period"] = "week",
    limit?: number
  ): Promise<ProductResponse> {
    return this.getFilteredProducts({ filter: "bestsellers", period, limit });
  },

  // Get trending products
  async getTrendingProducts(limit?: number): Promise<ProductResponse> {
    return this.getFilteredProducts({ filter: "trending", limit });
  },

  // Get paginated products
  async getPaginatedProducts(
    page: number = 1,
    pageSize: number = 10,
    filters: Omit<ProductFilters, "limit" | "offset"> = {}
  ): Promise<ProductResponse> {
    const offset = (page - 1) * pageSize;
    return this.getFilteredProducts({ ...filters, limit: pageSize, offset });
  },
};
