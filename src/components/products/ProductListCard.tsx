// components/ProductListCard.tsx
import React, { useState, useMemo } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import type { ProductCardProps } from "../../types/products.types";

const ProductListCard: React.FC<ProductCardProps> = ({
  product,
  onToggleWishlist,
  isWishlisted = false,
  className = "",
  onProductClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Memoize expensive calculations - same as grid card
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

  // Memoize available sizes for better performance
  const availableSizes = useMemo(() => {
    return product.productSizes.slice(0, 6);
  }, [product.productSizes]);

  const handleProductClick = (e: React.MouseEvent) => {
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
      className={`bg-white rounded  hover:border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        {/* Image section - compact for list view */}
        <div className="w-48 flex-shrink-0 relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Wishlist Button */}
          <div
            className={`absolute top-3 right-3 z-10 transition-all duration-300 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <button
              onClick={handleToggleWishlist}
              className="wishlist-button p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group/wishlist"
              aria-label="Toggle wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                  isWishlisted
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-600 group-hover/wishlist:text-red-500"
                }`}
              />
            </button>
          </div>

          {productData.mainImage ? (
            <img
              src={`${S3_BASE_URL}${productData.mainImage.imageUrl}`}
              alt={productData.mainImage.altText || product.name}
              className="w-full h-full object-contain transition-all duration-500 hover:scale-110"
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

          {!productData.isInStock && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10" />
              <div className="absolute bottom-3 left-3 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
                Out of Stock
              </div>
            </>
          )}
        </div>

        {/* Content section - expanded for list view */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {product.category && (
              <p className="text-sm text-blue-600 font-medium uppercase tracking-wider mb-2">
                {product.category.name}
              </p>
            )}

            <h3
              className={`font-bold text-lg text-gray-900 mb-2 line-clamp-2 transition-colors duration-200 ${
                isHovered ? "text-blue-600" : ""
              }`}
            >
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Available Sizes */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {availableSizes.map((size) => (
                <span
                  key={size.stockName}
                  className={`text-xs px-2 py-1 rounded ${
                    size.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {size.stockName}
                </span>
              ))}
              {product.productSizes.length > 6 && (
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500">
                  +{product.productSizes.length - 6} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex p-8 items-center">
          <div className="flex flex-col  ">
            <span className="text-2xl font-bold text-gray-900">
              ₹{productData.discountedPrice.toFixed(2)}
            </span>
            {productData.discountPercentage > 0 && (
              <div className="flex">
                <span className="text-sm text-gray-400 line-through font-medium">
                  ₹{productData.originalPrice.toFixed(2)}
                </span>
                <div className="text-green-700 px-2 py-1 text-xs font-bold">
                  {productData.discountPercentage}% off
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;
