// components/cart/CartItemCard.tsx
import React, { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Loader2,
  Package,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "../../types/cart.types";
import { useCartContext } from "../../context/CartContext";
const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, actionLoading } = useCartContext();
  const [imageError, setImageError] = useState(false);

  const isLoading = actionLoading === item.id;

  // Get stock status
  const isOutOfStock = item.statusCode === "OUT_OF_STOCK";
  const hasQuantityIssue = item.statusCode === "QUANTITY_EXCEEDED";
  const hasLowStock = item.statusCode === "LOW_STOCK";

  // Fix: Use availableStock directly for max quantity, not maxAllowed
  const maxQuantityAllowed =
    item.stockInfo?.availableStock || item.availableStock;
  const suggestedQuantity = item.stockInfo?.maxAllowed || item.availableStock; // For the "Fix" button
  
  const handleQuantityChange = async (newQuantity: number) => {
    // Remove item if quantity goes to 0
    if (newQuantity < 1) {
      await removeFromCart(item.id);
      return;
    }

    const isReducing = newQuantity < item.quantity;
    const isIncreasing = newQuantity > item.quantity;

    if (isReducing) {
      // Always allow reducing quantity - no stock check needed
      await updateQuantity(item.id, newQuantity);
    } else if (isIncreasing && newQuantity <= maxQuantityAllowed) {
      // Only check stock limit when increasing
      await updateQuantity(item.id, newQuantity);
    }
    // If same quantity or trying to increase beyond stock, do nothing
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
  };

  // Fix quantity to suggested amount
  const handleFixQuantity = async () => {
    await updateQuantity(item.id, suggestedQuantity);
  };

  // Card styling based on status
  const getCardClasses = () => {
    if (isOutOfStock) {
      return "bg-red-50 border-red-200 relative";
    }
    if (hasQuantityIssue) {
      return "bg-orange-50 border-orange-200";
    }
    if (hasLowStock) {
      return "bg-yellow-50 border-yellow-200";
    }
    return "bg-white border-gray-200";
  };

  return (
    <div
      className={`rounded-lg shadow-sm border p-6 relative ${getCardClasses()}`}
    >
      {/* Out of stock overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-lg z-0" />
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row gap-6 relative z-10 ${
          isOutOfStock ? "opacity-60" : ""
        }`}
      >
        {/* Product Image */}
        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
          <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
            {item.mainImage && !imageError ? (
              <img
                src={`${S3_BASE_URL}${item.mainImage.imageUrl}`}
                alt={item.mainImage.altText || item.name}
                className={`w-full h-full object-cover hover:scale-105 transition-transform ${
                  isOutOfStock ? "grayscale" : ""
                }`}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-12 h-12" />
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex-1">
              <Link
                to={`/product/${item.productId}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>

              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-600">
                  {item.category.parentCategory && (
                    <span>{item.category.parentCategory.name} / </span>
                  )}
                  {item.category.name}
                </p>
                <p className="text-sm text-gray-600">
                  Size: <span className="font-medium">{item.stockName}</span>
                </p>

                {/* Stock Status Messages */}
                {isOutOfStock && (
                  <div className="flex items-center gap-1 text-red-600 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Out of Stock</span>
                  </div>
                )}

                {hasQuantityIssue && (
                  <div className="flex items-center gap-1 text-orange-600 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{item.message}</span>
                  </div>
                )}

                {hasLowStock && (
                  <div className="flex items-center gap-1 text-yellow-600 font-medium">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">{item.message}</span>
                  </div>
                )}

                {/* Available stock info for debugging */}
                <p className="text-xs text-gray-500">
                  Available: {maxQuantityAllowed} | In cart: {item.quantity}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="flex flex-col items-end">
                <span
                  className={`text-xl font-bold ${
                    isOutOfStock ? "text-gray-500" : "text-gray-900"
                  }`}
                >
                  ₹{item.subtotal}
                </span>
                {item.discount > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.originalSubtotal}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Save ₹{item.discount}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            {/* Quantity Controls or Remove Only */}
            {isOutOfStock ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">
                  Item unavailable
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-12 text-center font-medium text-gray-900">
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isLoading || item.quantity >= maxQuantityAllowed}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {hasQuantityIssue && (
                  <button
                    onClick={handleFixQuantity}
                    disabled={isLoading}
                    className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium hover:bg-orange-200 transition-colors"
                  >
                    Fix ({suggestedQuantity})
                  </button>
                )}
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className={`flex items-center gap-1 text-sm font-medium disabled:opacity-50 ${
                isOutOfStock
                  ? "text-red-700 hover:text-red-800 bg-red-100 px-3 py-1 rounded"
                  : "text-red-600 hover:text-red-700"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {isOutOfStock ? "Remove Unavailable Item" : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
