// components/ProductCard.tsx
import React, { useState } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import type { ProductCardProps } from "../../types/products.types";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

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
    onProductClick?.(product.id!);
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group overflow-hidden ${className}`}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm">
          -{discountPercentage}%
        </div>
      )}

      {/* Wishlist Button - Larger touch target for mobile */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.(product.id!);
        }}
        className="wishlist-button absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group/wishlist"
        aria-label="Toggle wishlist"
      >
        <Heart
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
            isWishlisted 
              ? "fill-red-500 text-red-500 scale-110" 
              : "text-gray-600 group-hover/wishlist:text-red-500"
          }`}
        />
      </button>

      {/* Image Container - Fixed aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
        {mainImage ? (
          <img
            // --- CHANGE IS HERE ---
            // Construct the full URL using the base URL and the image key
            src={`${S3_BASE_URL}${mainImage.imageUrl}`} 
            alt={mainImage.altText || product.name}
            className={`w-full h-full object-contain transition-all duration-500 ${
              isHovered ? "scale-110 brightness-105" : "scale-100"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <div className="text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No image</p>
            </div>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!isInStock && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10 pointer-events-none" />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-red-600 bg-opacity-95 text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xl backdrop-blur-sm">
              Out of Stock
            </div>
          </>
        )}

        {/* Quick View Button - Shows on hover */}
        <div className={`absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
            <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Quick View
            </span>
          </div>
        </div>
      </div>

      {/* Product Info - Flex grow to fill remaining space */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Category - Fixed height */}
        <div className="h-5 mb-1 sm:mb-2">
          {product.category && (
            <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider truncate">
              {product.category.name}
            </p>
          )}
        </div>

        {/* Product Name - Fixed height with line clamp */}
        <div className="h-10 sm:h-12 mb-2">
          <h3
            className={`font-bold text-sm sm:text-base text-gray-900 line-clamp-2 transition-colors duration-200 leading-tight ${
              isHovered ? "text-indigo-600" : ""
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
        <div className="hidden sm:block h-10 mb-3">
          <p 
            className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed"
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
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-lg sm:text-2xl font-black text-gray-900">
              ₹{price.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
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