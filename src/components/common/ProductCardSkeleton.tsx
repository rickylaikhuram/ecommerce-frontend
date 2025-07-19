// components/ProductCardSkeleton.tsx
import React from "react";

const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden ${className}`}
    >
      {/* Skeleton Discount Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <div className="h-6 w-16 sm:h-7 sm:w-20 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Wishlist Button */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Image Container */}
      <div className="relative aspect-square bg-gray-100 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      </div>

      {/* Skeleton Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Skeleton Category */}
        <div className="h-5 mb-1 sm:mb-2">
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Skeleton Product Name */}
        <div className="h-10 sm:h-12 mb-2">
          <div className="h-4 bg-gray-300 rounded mb-1 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
        </div>

        {/* Skeleton Product Description - Desktop only */}
        <div className="hidden sm:block h-10 mb-3">
          <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>

        {/* Skeleton Price Section */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <div className="h-6 w-24 sm:h-8 sm:w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-16 sm:h-5 sm:w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;