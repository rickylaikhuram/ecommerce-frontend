import { useState, useCallback, useEffect } from "react";
import type { ProductFilters } from "../types/products.types";

interface UseProductFiltersReturn {
  // Filter states
  searchTerm: string;
  selectedCategory: string;
  sortBy: ProductFilters["sortBy"];
  currentPage: number;
  priceRange: { min: number; max: number };
  selectedSizes: string[];
  
  // Filter actions
  setSearchTerm: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSortBy: (value: ProductFilters["sortBy"]) => void;
  setCurrentPage: (value: number) => void;
  setPriceRange: (value: { min: number; max: number }) => void;
  setSelectedSizes: (value: string[]) => void;
  
  // Computed values
  currentFilters: ProductFilters;
  hasActiveFilters: boolean;
  
  // Actions
  clearAllFilters: () => void;
  buildFiltersFromState: () => ProductFilters;
  initializeFromURL: () => ProductFilters;
  updateURL: (filters: Partial<ProductFilters>) => void;
}

export const useProductFilters = (): UseProductFiltersReturn => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<ProductFilters["sortBy"]>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Build filters object from current state
  const buildFiltersFromState = useCallback((): ProductFilters => {
    return {
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      sortBy,
      minPrice: priceRange.min > 0 ? priceRange.min : undefined,
      maxPrice: priceRange.max < 1000 ? priceRange.max : undefined,
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      limit: 12,
      offset: (currentPage - 1) * 12,
    };
  }, [searchTerm, selectedCategory, sortBy, currentPage, priceRange, selectedSizes]);

  // Get current filters
  const currentFilters = buildFiltersFromState();

  // Check if there are active filters
  const hasActiveFilters = Boolean(
    searchTerm ||
    selectedCategory ||
    selectedSizes.length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 1000
  );

  // Update URL with current filters
  const updateURL = useCallback((filters: Partial<ProductFilters>) => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sizes && filters.sizes.length > 0)
      params.set("sizes", filters.sizes.join(","));
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (filters.minPrice && filters.minPrice > 0) 
      params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice && filters.maxPrice < 1000) 
      params.set("maxPrice", filters.maxPrice.toString());

    const newUrl = `${window.location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;
    window.history.pushState({}, "", newUrl);
  }, [currentPage]);

  // Initialize from URL parameters
  const initializeFromURL = useCallback((): ProductFilters => {
    const params = new URLSearchParams(window.location.search);
    
    const initialSearch = params.get("search") || "";
    const initialCategory = params.get("category") || "";
    const initialSort = (params.get("sortBy") as ProductFilters["sortBy"]) || "newest";
    const initialMinPrice = Number(params.get("minPrice")) || 0;
    const initialMaxPrice = Number(params.get("maxPrice")) || 1000;
    const initialSizes = params.get("sizes")?.split(",").filter(Boolean) || [];
    const initialPage = Number(params.get("page")) || 1;

    // Set states
    setSearchTerm(initialSearch);
    setSelectedCategory(initialCategory);
    setSortBy(initialSort);
    setPriceRange({ min: initialMinPrice, max: initialMaxPrice });
    setSelectedSizes(initialSizes);
    setCurrentPage(initialPage);

    // Return filters object
    return {
      search: initialSearch || undefined,
      category: initialCategory || undefined,
      sortBy: initialSort,
      minPrice: initialMinPrice > 0 ? initialMinPrice : undefined,
      maxPrice: initialMaxPrice < 1000 ? initialMaxPrice : undefined,
      sizes: initialSizes.length > 0 ? initialSizes : undefined,
      limit: 12,
      offset: (initialPage - 1) * 12,
    };
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
    setPriceRange({ min: 0, max: 1000 });
    setSelectedSizes([]);
    setCurrentPage(1);
  }, []);

  return {
    // States
    searchTerm,
    selectedCategory,
    sortBy,
    currentPage,
    priceRange,
    selectedSizes,
    
    // Setters
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
    setPriceRange,
    setSelectedSizes,
    
    // Computed
    currentFilters,
    hasActiveFilters,
    
    // Actions
    clearAllFilters,
    buildFiltersFromState,
    initializeFromURL,
    updateURL,
  };
};