// components/cart/CartSummary.tsx
import React from 'react';
import { ShoppingBag, Tag, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartSummary as CartSummaryType } from '../../types/cart.types';

interface CartSummaryProps {
  summary: CartSummaryType;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ summary }) => {
  const shippingCost = summary.totalPrice > 50 ? 0 : 10;
  const finalTotal = summary.totalPrice + shippingCost ;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        {/* Items */}
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Items ({summary.totalItems})
          </span>
          <span>{summary.totalOriginalPrice}</span>
        </div>

        {/* Discount */}
        {summary.totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Discount
            </span>
            <span>-{summary.totalDiscount}</span>
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between font-medium text-gray-900 pb-4 border-b">
          <span>Subtotal</span>
          <span>{summary.totalPrice}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping
          </span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              (shippingCost)
            )}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
          <span>Total</span>
          <span>{(finalTotal)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Proceed to Checkout
      </Link>

      {/* Security Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Secure checkout powered by SSL encryption
        </p>
      </div>
    </div>
  );
};