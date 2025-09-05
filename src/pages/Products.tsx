import { useEffect, useCallback, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProductFilters } from "../types/products.types";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { fetchWishlistedIds } from "../redux/slice/wishlist";
// Import categories action
import { fetchCategories } from "../redux/slice/categories";

// Custom hooks
import { useProductFilters } from "../hooks/useProductFilters";
import { useProductData } from "../hooks/useProductData";

// Components
import ProductsHeader from "../components/products/ProductsHeader";
import ActiveFilters from "../components/products/ActiveFilters";
import FilterSidebar from "../components/products/FilterSidebar";
import ProductsGrid from "../components/products/ProductsGrid";
import Pagination from "../components/products/Pagination";
import Footer from "../components/section/Footer";

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { user, status } = useAppSelector((state) => state.auth);
  const isAuthenticated = user?.role === "user" && status === "succeeded";

  // Get categories status from Redux to avoid duplicate calls
  const { status: categoriesStatus } = useAppSelector(
    (state) => state.categories
  );

  // Custom hooks
  const {
    searchTerm,
    selectedCategory,
    sortBy,
    currentPage,
    selectedSizes,
    priceRange,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
    setSelectedSizes,
    clearAllFilters,
    buildFiltersFromState,
    initializeFromURL,
    updateURL,
  } = useProductFilters();

  const {
    products,
    categories,
    pagination,
    sizes,
    loading,
    error,
    categoriesLoading,
    fetchProducts,
    clearError,
    totalPages,
  } = useProductData();

  // Local UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Handle responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewMode("list");
      } else {
        setViewMode("grid");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize data on mount - consolidated to single useEffect
  useEffect(() => {
    const initializeData = async () => {
      const initialFilters = initializeFromURL();

      // Load categories only if not already loaded/loading
      if (categoriesStatus === "idle") {
        dispatch(fetchCategories());
      }

      // Load products
      fetchProducts(initialFilters);

      // Load wishlist data if user is authenticated
      if (isAuthenticated) {
        dispatch(fetchWishlistedIds());
      }
    };

    initializeData();
  }, [
    isAuthenticated,
    dispatch,
    categoriesStatus,
    initializeFromURL,
    fetchProducts,
  ]);

  // Product click handler
  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/products/${productId}`);
    },
    [navigate]
  );

  // Filter change handlers with URL update and refetch - Updated for page-based pagination
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to first page

      const filters: ProductFilters = {
        ...buildFiltersFromState(),
        search: value || undefined,
        page: 1, // Changed from offset: 0 to page: 1
      };

      updateURL(filters);
      fetchProducts(filters);
    },
    [
      setSearchTerm,
      setCurrentPage,
      buildFiltersFromState,
      updateURL,
      fetchProducts,
    ]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setCurrentPage(1); // Reset to first page

      const filters: ProductFilters = {
        ...buildFiltersFromState(),
        category: category || undefined,
        page: 1, // Changed from offset: 0 to page: 1
      };

      updateURL(filters);
      fetchProducts(filters);
    },
    [
      setSelectedCategory,
      setCurrentPage,
      buildFiltersFromState,
      updateURL,
      fetchProducts,
    ]
  );

  const handleSortChange = useCallback(
    (newSortBy: ProductFilters["sortBy"]) => {
      setSortBy(newSortBy);

      const filters: ProductFilters = {
        ...buildFiltersFromState(),
        sortBy: newSortBy,
      };

      updateURL(filters);
      fetchProducts(filters);
    },
    [setSortBy, buildFiltersFromState, updateURL, fetchProducts]
  );

  // Updated handlePageChange to work with page numbers instead of offset
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      const filters: ProductFilters = {
        ...buildFiltersFromState(),
        page: page, // Direct page number instead of offset calculation
      };

      updateURL(filters);
      fetchProducts(filters);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setCurrentPage, buildFiltersFromState, updateURL, fetchProducts]
  );

  const handleSizeToggle = useCallback(
    (size: string) => {
      const newSizes = selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size];

      setSelectedSizes(newSizes);
      setCurrentPage(1); // Reset to first page

      const filters: ProductFilters = {
        ...buildFiltersFromState(),
        sizes: newSizes.length > 0 ? newSizes : undefined,
        page: 1, // Changed from offset: 0 to page: 1
      };

      updateURL(filters);
      fetchProducts(filters);
    },
    [
      selectedSizes,
      setSelectedSizes,
      setCurrentPage,
      buildFiltersFromState,
      updateURL,
      fetchProducts,
    ]
  );

  const handleClearAllFilters = useCallback(() => {
    clearAllFilters();
    setShowMobileFilters(false);

    const filters: ProductFilters = {
      sortBy: "newest",
      limit: 20, // Updated to match backend default
      page: 1, // Changed from offset: 0 to page: 1
    };

    updateURL(filters);
    fetchProducts(filters);
  }, [clearAllFilters, updateURL, fetchProducts]);

  const handleApplyMobileFilters = useCallback(() => {
    setShowMobileFilters(false);
    setCurrentPage(1); // Reset to first page

    const filters: ProductFilters = {
      ...buildFiltersFromState(),
      page: 1, // Changed from offset: 0 to page: 1
    };

    updateURL(filters);
    fetchProducts(filters);
  }, [
    setShowMobileFilters,
    setCurrentPage,
    buildFiltersFromState,
    updateURL,
    fetchProducts,
  ]);

  const handleRetryAfterError = useCallback(() => {
    clearError();
    fetchProducts(buildFiltersFromState());
  }, [clearError, fetchProducts, buildFiltersFromState]);

  const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "best-seller", label: "Best Seller" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Updated to use new pagination structure */}
      <ProductsHeader
        searchTerm={searchTerm}
        sortBy={sortBy}
        viewMode={viewMode}
        totalProducts={pagination.totalCount} // Changed from pagination.total
        onSortChange={handleSortChange}
        onViewModeChange={setViewMode}
      />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced pagination info display */}
        {!loading && products.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {pagination.startItem}-{pagination.endItem} of{" "}
            {pagination.totalCount} products
            {pagination.totalPages > 1 && (
              <span className="ml-2">
                (Page {pagination.currentPage} of {pagination.totalPages})
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              {categoriesLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <FilterSidebar
                  categories={categories}
                  availableSizes={sizes}
                  selectedCategory={selectedCategory}
                  selectedSizes={selectedSizes}
                  onCategoryChange={handleCategoryChange}
                  onSizeToggle={handleSizeToggle}
                  onClearFilters={handleClearAllFilters}
                />
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={handleRetryAfterError}
                      className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600 transition-colors"
                    >
                      <span className="text-xs">Retry</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters */}
            <ActiveFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedSizes={selectedSizes}
              priceRange={priceRange}
              onRemoveSearch={() => handleSearchChange("")}
              onRemoveCategory={() => handleCategoryChange("")}
              onRemoveSize={handleSizeToggle}
              onClearAll={handleClearAllFilters}
            />

            {/* Mobile Controls */}
            <div className="md:hidden mb-6 flex justify-between items-center gap-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortChange(e.target.value as ProductFilters["sortBy"])
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid/List */}
            <ProductsGrid
              products={products}
              viewMode={viewMode}
              loading={loading}
              onProductClick={handleProductClick}
              onClearFilters={handleClearAllFilters}
            />

            {/* Enhanced Pagination Component */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
                // Additional pagination info
                hasMore={pagination.hasMore}
                hasPrevious={pagination.hasPrevious}
                totalItems={pagination.totalCount}
                itemsPerPage={pagination.itemsPerPage}
                startItem={pagination.startItem}
                endItem={pagination.endItem}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-80 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            {categoriesLoading ? (
              <div className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ) : (
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSizes={selectedSizes}
                availableSizes={sizes}
                onCategoryChange={handleCategoryChange}
                onSizeToggle={handleSizeToggle}
                onClearFilters={handleClearAllFilters}
                onApplyFilters={handleApplyMobileFilters}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
              />
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductsPage;
