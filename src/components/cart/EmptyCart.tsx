// components/cart/EmptyCart.tsx
import React from "react";
import {
  ShoppingCart,
  ArrowRight,
  RotateCcw,
  CreditCard,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyCart: React.FC = () => {
  return (
    <div className="pt-10 bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>

          <p className="text-gray-600 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Why shop with us?
            </h3>

            <div className="flex justify-center gap-10">
              <div className="flex flex-col items-center">
                <Truck className="w-6 h-6 text-emerald-600 mb-1" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>

              <div className="flex flex-col items-center">
                <CreditCard className="w-6 h-6 text-emerald-600 mb-1" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>

              <div className="flex flex-col items-center">
                <RotateCcw className="w-6 h-6 text-emerald-600 mb-1" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
