import React from "react";
import { Search } from "lucide-react";
import type { Product } from "../../types/products.types";
import ProductGridCard from "./ProductGridCard";
import ProductListCard from "./ProductListCard";

interface ProductsGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  loading: boolean;
  onProductClick: (productId: string) => void;
  onClearFilters: () => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  viewMode,
  loading,
  onProductClick,
  onClearFilters,
}) => {

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">
            Try adjusting your filters or search terms
          </p>
        </div>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  // Grid view
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 xs:w-48">
            <ProductGridCard
              product={product}
              onProductClick={onProductClick}
            />
          </div>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div key={product.id}>
          <ProductListCard
            product={product}
            onProductClick={onProductClick}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;