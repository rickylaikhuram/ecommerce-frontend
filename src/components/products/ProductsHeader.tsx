import React from "react";
import { Grid, List } from "lucide-react";
import type { ProductFilters } from "../../types/products.types";

interface ProductsHeaderProps {
  searchTerm: string;
  sortBy: ProductFilters["sortBy"];
  viewMode: "grid" | "list";
  totalProducts: number;
  onSortChange: (sortBy: ProductFilters["sortBy"]) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "best-seller", label: "Best Seller" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
] as const;

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  searchTerm,
  sortBy,
  viewMode,
  totalProducts,
  onSortChange,
  onViewModeChange,
}) => {
  return (
    <div className="bg-white shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Title and count */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {searchTerm ? searchTerm : "All Products"}
            </h1>
            <span className="text-sm text-gray-500">
              {totalProducts} products
            </span>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as ProductFilters["sortBy"])
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View mode toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;