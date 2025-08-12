// components/checkout/CartValidationModal.tsx
import React from "react";
import { AlertTriangle, ShoppingCart, X } from "lucide-react";

interface CartValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
  validationMessage: string;
}

const CartValidationModal: React.FC<CartValidationModalProps> = ({
  isOpen,
  onClose,
  onGoToCart,
  validationMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 bg-opacity-50" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
        {/* Modal body */}
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cart Validation Error
              </h3>
              <p className="text-sm text-gray-600">
                {validationMessage ||
                  "Some items in your cart are no longer available or have quantity issues. Please review and fix your cart before proceeding with payment."}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onGoToCart}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Go to Cart to Fix Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartValidationModal;
