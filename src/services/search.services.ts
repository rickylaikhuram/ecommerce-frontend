// services/search.service.ts
import instance from "../utils/axios";
import type { SearchResponse } from "../types/search.types";

class SearchService {
  private baseUrl = "/product/search";

  async getAutocomplete(query: string, limit = 8): Promise<SearchResponse> {
    try {
      const response = await instance.get(`${this.baseUrl}/autocomplete`, {
        params: {
          q: query,
          limit: limit
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Search failed'
      );
    }
  }

  async getPopularSearches(limit = 5): Promise<SearchResponse> {
    try {
      const response = await instance.get(`${this.baseUrl}/popular`, {
        params: { limit }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch popular searches'
      );
    }
  }
}

export const searchService = new SearchService();