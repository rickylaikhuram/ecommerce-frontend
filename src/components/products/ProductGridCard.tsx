// components/ProductCard.tsx
import React, { useState, useMemo } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import type { ProductCardProps } from "../../types/products.types";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleWishlist,
  isWishlisted = false,
  className = "",
  onProductClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Memoize expensive calculations
  const productData = useMemo(() => {
    const originalPrice = parseFloat(product.originalPrice.toString());
    const discountedPrice = parseFloat(product.discountedPrice.toString());
    const discountPercentage =
      originalPrice > discountedPrice
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : 0;

    const mainImage =
      product.images.find((img) => img.isMain) || product.images[0];
    const isInStock =
      product.productSizes?.some((size) => size.stock > 0) ?? false;

    return {
      originalPrice,
      discountedPrice,
      discountPercentage,
      mainImage,
      isInStock,
    };
  }, [product]);

  // Memoize S3 URL to prevent recreation
  const S3_BASE_URL = useMemo(() => import.meta.env.VITE_S3_BASE_URL, []);

  const handleProductClick = (e: React.MouseEvent) => {
    // Prevent click when clicking on wishlist button
    if ((e.target as HTMLElement).closest(".wishlist-button")) {
      return;
    }
    onProductClick?.(product.id!);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist?.(product.id!);
  };

  return (
    <div
      className={`relative bg-white rounded  hover:border-gray-200 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group overflow-hidden ${className}`}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {productData.discountPercentage > 0 && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm">
          -{productData.discountPercentage}%
        </div>
      )}

      {/* Wishlist Button - Only shows on hover */}
      <div
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 transition-all duration-300 ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <button
          onClick={handleToggleWishlist}
          className="wishlist-button p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group/wishlist"
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
      </div>

      {/* Image Container - Fixed aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
        {productData.mainImage ? (
          <img
            src={`${S3_BASE_URL}${productData.mainImage.imageUrl}`}
            alt={productData.mainImage.altText || product.name}
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
        {!productData.isInStock && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10 pointer-events-none" />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-red-600 bg-opacity-95 text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xl backdrop-blur-sm">
              Out of Stock
            </div>
          </>
        )}
      </div>

      {/* Product Info - Flex grow to fill remaining space */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Category - Fixed height */}
        <div className="h-5 mb-1 sm:mb-2">
          {product.category && (
            <p className="text-xs sm:text-sm text-blue-600 font-medium uppercase tracking-wider truncate">
              {product.category.name}
            </p>
          )}
        </div>

        {/* Product Name - Fixed height with line clamp */}
        <div className="h-10 sm:h-12 mb-2">
          <h3
            className={`font-bold text-sm sm:text-base text-gray-900 line-clamp-2 transition-colors duration-200 leading-tight ${
              isHovered ? "text-blue-600" : ""
            }`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.25rem",
            }}
          >
            {product.name}
          </h3>
        </div>

        {/* Price Section - Always at bottom */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-lg sm:text-2xl font-black text-gray-900">
              ₹{productData.discountedPrice.toFixed(2)}
            </span>
            {productData.discountPercentage > 0 && (
              <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                ₹{productData.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
