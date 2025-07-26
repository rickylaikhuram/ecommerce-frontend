// components/cart/CartItemCard.tsx
import React, { useState } from "react";
import { Minus, Plus, Trash2, Loader2, Package } from "lucide-react";
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

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(item.id);
    } else if (newQuantity <= item.availableStock) {
      await updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Image */}
        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
          <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
            {item.mainImage && !imageError ? (
              <img
                src={`${S3_BASE_URL}${item.mainImage.imageUrl}`}
                alt={item.mainImage.altText || item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
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

                {!item.stockVariantInStock && (
                  <p className="text-sm text-red-600 font-medium">
                    Out of stock
                  </p>
                )}
                {item.stockVariantInStock && item.availableStock < 5 && (
                  <p className="text-sm text-orange-600">
                    Only {item.availableStock} left in stock
                  </p>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-gray-900">
                  {item.subtotal}
                </span>
                {item.discount > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {item.originalSubtotal}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Save {item.discount}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            {/* Quantity Controls */}
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
                disabled={isLoading || item.quantity >= item.availableStock}
                className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
