// components/checkout/CartValidationAlert.tsx
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import type { CartCheckoutResponse } from "../../types/checkout.types";

interface CartValidationAlertProps {
  cartValidation: CartCheckoutResponse;
  onGoToCart: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const CartValidationAlert: React.FC<CartValidationAlertProps> = ({
  cartValidation,
  onGoToCart,
  onRefresh,
  isRefreshing,
}) => {
  if (cartValidation.canProceedToCheckout) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Cart Issues Detected
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {cartValidation.checkoutMessage}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={onGoToCart}
              className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
            >
              Go to Cart
            </button>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3 h-3 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartValidationAlert;