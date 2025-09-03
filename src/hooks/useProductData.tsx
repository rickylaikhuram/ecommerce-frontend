import { useState, useCallback } from "react";
import type {
  Product,
  Category,
  ProductFilters,
  ProductResponse,
} from "../types/products.types";
import { productService } from "../services/product.services";
import extractUniqueSizes from "../utils/extractSizes";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import {
  toggleWishlist as toggleWish,
  fetchWishlistedIds,
  selectWishlistedIds,
} from "../redux/slice/wishlist";
// Import categories from Redux
import { fetchCategories } from "../redux/slice/categories";

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
  categoriesLoading: boolean;

  // Actions
  fetchProducts: (filters: ProductFilters) => Promise<void>;
  loadCategories: () => Promise<void>;
  loadWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearError: () => void;

  // Computed
  totalPages: number;
}

export const useProductData = (): UseProductDataReturn => {
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { user, status } = useAppSelector((state) => state.auth);
  const isAuthenticated = user?.role === "user" && status === "succeeded";
  
  // Get wishlist state from Redux
  const wishlistedIds = useAppSelector(selectWishlistedIds);
  
  // Get categories from Redux instead of local state
  const { categories: reduxCategories, status: categoriesStatus } = useAppSelector((state) => state.categories);
  const categoriesLoading = categoriesStatus === "loading";

  // Data states (removed categories from local state)
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>(wishlistedIds);
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
      const response: ProductResponse =
        await productService.getFilteredProducts(filters);

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

  // Load categories using Redux - replaces fetchCategories
  const loadCategories = useCallback(async () => {
    // Only fetch if not already loaded or loading
    if (categoriesStatus === "idle") {
      try {
        await dispatch(fetchCategories()).unwrap();
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Error is handled by Redux, no need to set local error
      }
    }
  }, [dispatch, categoriesStatus]);

  // Load user's wishlist - only for authenticated users
  const loadWishlist = useCallback(async () => {
    // Only load wishlist if user is authenticated
    if (!isAuthenticated) {
      setWishlistedItems([]);
      return;
    }

    try {
      dispatch(fetchWishlistedIds());
    } catch (err) {
      console.error("Error loading wishlist:", err);
      // Don't show error to user for wishlist, just log it
      setWishlistedItems([]);
    }
  }, [dispatch, isAuthenticated]);

  // Toggle wishlist item - only for authenticated users
  const toggleWishlist = useCallback(
    async (productId: string) => {
      // Only allow wishlist toggle for authenticated users
      if (!isAuthenticated) {
        console.warn("User must be authenticated to use wishlist");
        // You might want to show a login modal or redirect here
        return;
      }

      try {
        await dispatch(toggleWish(productId)).unwrap();
      } catch (err) {
        console.error("Failed to toggle wishlist:", err);
        // Could show a toast notification here instead of setting main error
      }
    },
    [dispatch, isAuthenticated]
  );

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const totalPages = Math.ceil(pagination.total / (pagination.limit || 12));

  return {
    // Data
    products,
    categories: reduxCategories || [], // Use Redux categories
    wishlistedItems,
    pagination,
    sizes,
    // States
    loading,
    error,
    categoriesLoading,

    // Actions
    fetchProducts,
    loadCategories, // Renamed from fetchCategories
    loadWishlist,
    toggleWishlist,
    clearError,

    // Computed
    totalPages,
  };
};
