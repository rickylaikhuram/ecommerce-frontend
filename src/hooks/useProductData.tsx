import { useState, useCallback } from "react";
import type {
  Product,
  Category,
  ProductFilters,
  ProductResponse,
  CategoryResponse,
} from "../types/products.types";
import { productService } from "../services/product.services";
import { wishlistService } from "../services/wishlist.services";
import extractUniqueSizes from "../utils/extractSizes";

interface UseProductDataReturn {
  // Data states
  products: Product[];
  categories: Category[];
  wishlistedItems: string[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  sizes: string[];
  // Loading and error states
  loading: boolean;
  error: string | null;

  // Actions
  fetchProducts: (filters: ProductFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  loadWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearError: () => void;

  // Computed
  totalPages: number;
}

export const useProductData = (): UseProductDataReturn => {
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false,
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products with error handling and loading states
  const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching products with filters:", filters);
      const response: ProductResponse =
        await productService.getFilteredProducts(filters);

      console.log("Products fetched successfully:", {
        count: response.products.length,
        total: response.pagination.total,
      });

      setProducts(response.products);
      setPagination(response.pagination);
      const uniqueSizes = extractUniqueSizes(response.products);
      setSizes(uniqueSizes);
    } catch (error) {
      console.error("Error fetching products:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load products. Please try again.";
      setError(errorMessage);

      // Reset to empty state on error
      setProducts([]);
      setPagination({
        total: 0,
        limit: 12,
        offset: 0,
        hasMore: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories with error handling
  const fetchCategories = useCallback(async () => {
    try {
      console.log("Fetching categories...");
      const categoriesResponse: CategoryResponse =
        await productService.getCategories();

      console.log(
        "Categories fetched successfully:",
        categoriesResponse.categories?.length || 0
      );
      setCategories(categoriesResponse.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Don't set main error state for categories, just log it
      setCategories([]);
    }
  }, []);

  // Load user's wishlist
  const loadWishlist = useCallback(async () => {
    try {
      console.log("Loading wishlist...");
      const res = await wishlistService.getUserWishlistedIds();

      console.log(
        "Wishlist loaded successfully:",
        res.productIds.length,
        "items"
      );
      setWishlistedItems(res.productIds);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      // Don't show error to user for wishlist, just log it
      setWishlistedItems([]);
    }
  }, []);

  // Toggle wishlist item
  const toggleWishlist = useCallback(async (productId: string) => {
    try {
      console.log("Toggling wishlist for product:", productId);
      await wishlistService.toggleWishlist(productId);

      setWishlistedItems((prev) => {
        const newWishlist = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];

        console.log("Wishlist updated:", {
          productId,
          action: prev.includes(productId) ? "removed" : "added",
          newCount: newWishlist.length,
        });

        return newWishlist;
      });
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
      // Could show a toast notification here instead of setting main error
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const totalPages = Math.ceil(pagination.total / (pagination.limit || 12));

  return {
    // Data
    products,
    categories,
    wishlistedItems,
    pagination,
    sizes,
    // States
    loading,
    error,

    // Actions
    fetchProducts,
    fetchCategories,
    loadWishlist,
    toggleWishlist,
    clearError,

    // Computed
    totalPages,
  };
};
