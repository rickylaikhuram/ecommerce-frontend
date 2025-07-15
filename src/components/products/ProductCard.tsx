// components/ProductCard.tsx
import React, { useState } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import type { ProductCardProps } from "../../types/products.types";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleWishlist,
  isWishlisted = false,
  className = "",
  onProductClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get main image or first image
  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];

  // Calculate discount percentage
  const price = parseFloat(product.price.toString());
  const fakePrice = parseFloat(product.fakePrice.toString());
  const discountPercentage =
    fakePrice > price ? Math.round(((fakePrice - price) / fakePrice) * 100) : 0;

  // Check if product is in stock
  const isInStock =
    product.productSizes?.some((size) => size.stock > 0) ?? false;

  const handleProductClick = (e: React.MouseEvent) => {
    // Prevent click when clicking on wishlist button
    if ((e.target as HTMLElement).closest(".wishlist-button")) {
      return;
    }
    onProductClick?.(product.id);
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col ${className}`}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 bg-green-700 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {discountPercentage}% off
        </div>
      )}

      {/* Wishlist Button - Larger touch target for mobile */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.(product.id);
        }}
        className="wishlist-button absolute top-1 right-1 sm:top-2 sm:right-2 z-10 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        aria-label="Toggle wishlist"
      >
        <Heart
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* Image Container - Fixed aspect ratio */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100 flex-shrink-0">
        {mainImage ? (
          <img
            src={mainImage.imageUrl}
            alt={mainImage.altText || product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!isInStock && (
          <>
            <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 z-20 bg-red-700 bg-opacity-90 text-white text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-md">
              Out of Stock
            </div>
          </>
        )}
      </div>

      {/* Product Info - Flex grow to fill remaining space */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Category - Fixed height */}
        <div className="h-4 mb-0.5 sm:mb-1">
          {product.category && (
            <p className="text-xs text-gray-500 truncate">
              {product.category.name}
            </p>
          )}
        </div>

        {/* Product Name - Fixed height with line clamp */}
        <div className="h-10 sm:h-12 mb-1">
          <h3
            className={`font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 transition-colors ${
              isHovered ? "text-blue-600" : ""
            }`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.25rem',
            }}
          >
            {product.name}
          </h3>
        </div>

        {/* Product Description - Fixed height on desktop */}
        <div className="hidden sm:block h-10 mb-2">
          <p 
            className="text-xs sm:text-sm text-gray-600 line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.25rem',
            }}
          >
            {product.description}
          </p>
        </div>

        {/* Spacer to push price to bottom */}
        {/* <div className="flex-grow"></div> */}

        {/* Price Section - Always at bottom */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-base sm:text-xl font-bold text-gray-900">
              ₹{price.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ₹{fakePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;