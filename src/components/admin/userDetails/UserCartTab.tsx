// components/admin/userDetail/UserCartTab.tsx
import React from "react";
import { ShoppingCart, DollarSign, Calendar } from "lucide-react";
import type { CartItem } from "../../../types/admin/userDetail.types";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface UserCartTabProps {
  cart: CartItem[];
  loading: boolean;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export const UserCartTab: React.FC<UserCartTabProps> = ({
  cart,
  loading,
  formatDate,
  formatCurrency,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No cart items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex space-x-4">
            {item.product.images.length > 0 ? (
              <img
                src={`${S3_BASE_URL}${item.product.images[0].imageUrl}`}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.product.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.product.description}
              </p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="font-medium text-green-600">
                      {formatCurrency(item.product.discountedPrice)}
                    </span>
                    {item.product.originalPrice !==
                      item.product.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatCurrency(item.product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    item.product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.product.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                Added: {formatDate(item.addedAt)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
