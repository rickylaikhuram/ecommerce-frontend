// components/checkout/PricingSidebar.tsx
import React from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  RefreshCw 
} from "lucide-react";
import type { CartCheckoutResponse } from "../../types/checkout.types";
import type { Settings } from "../../redux/slice/delivery";

interface PricingDetails {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  savings: number;
}

interface PricingSidebarProps {
  pricingDetails: PricingDetails;
  cartValidation: CartCheckoutResponse | null;
  validItemsCount: number;
  invalidItemsCount: number;
  totalItems: number;
  canProceedToPayment: boolean;
  isValidatingCart: boolean;
  deliverySetting: Settings | null;
}

const PricingSidebar: React.FC<PricingSidebarProps> = ({
  pricingDetails,
  cartValidation,
  validItemsCount,
  invalidItemsCount,
  totalItems,
  canProceedToPayment,
  isValidatingCart,
  deliverySetting,
}) => {
  // Calculate original price from cart validation
  const originalPrice = cartValidation?.cartSummary?.totalOriginalPrice || 0;
  const discountedPrice = cartValidation?.cartSummary?.totalDiscountedPrice || pricingDetails.subtotal;

  return (
    <div className="mt-8 lg:mt-0 space-y-6">
      {/* Price Details */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 sticky top-24">
        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
          Order Summary
        </h3>

        {/* Cart validation summary */}
        {cartValidation && (
          <div className="mb-4">
            {invalidItemsCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Issues Found
                  </span>
                </div>
                <div className="text-xs text-red-600 space-y-1">
                  {cartValidation.cartSummary.hasOutOfStockItems && (
                    <p>
                      • {cartValidation.recommendations?.outOfStockCount || 0} out of stock item(s)
                    </p>
                  )}
                  {cartValidation.cartSummary.hasQuantityIssues && (
                    <p>
                      • {cartValidation.recommendations?.quantityIssuesCount || 0} quantity issue(s)
                    </p>
                  )}
                  {cartValidation.cartSummary.hasLowStockWarnings && (
                    <p>
                      • {cartValidation.recommendations?.lowStockCount || 0} low stock warning(s)
                    </p>
                  )}
                </div>
              </div>
            )}

            {validItemsCount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {validItemsCount} item{validItemsCount > 1 ? "s" : ""} ready for checkout
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {/* Original Price */}
          {originalPrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Original Price
              </span>
              <span className="font-semibold text-gray-500 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            </div>
          )}

          {/* Discount Applied */}
          {pricingDetails.discount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Discount Applied</span>
              <span className="font-semibold">
                -₹{pricingDetails.discount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Subtotal after discount */}
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">
              {pricingDetails.discount > 0 ? "Discounted Price" : "Subtotal"}
            </span>
            <span className="font-semibold text-gray-800">
              ₹{discountedPrice.toFixed(2)}
            </span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-semibold">
              {pricingDetails.deliveryFee === 0 ? (
                <span className="text-green-600 font-medium">FREE</span>
              ) : (
                `₹${pricingDetails.deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>

          {/* Free shipping threshold message */}
          {deliverySetting?.takeDeliveryFee &&
            deliverySetting?.checkThreshold &&
            pricingDetails.deliveryFee > 0 &&
            deliverySetting?.freeDeliveryThreshold && (
              <div className="text-xs text-gray-500 bg-emerald-50 p-2 rounded">
                Add ₹
                {(Number(deliverySetting.freeDeliveryThreshold) - discountedPrice).toFixed(2)}{" "}
                more for free delivery
              </div>
            )}

          <hr className="border-gray-200" />

          {/* Total Amount - Prominent Display */}
          <div className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-lg p-4">
            <span>Pay Amount</span>
            <span>₹{pricingDetails.total.toFixed(2)}</span>
          </div>

          {/* You're Saving */}
          {pricingDetails.savings > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <p className="text-green-700 font-medium">
                  🎉 You're Saving:
                </p>
                <p className="text-green-700 font-bold text-lg">
                  ₹{pricingDetails.savings.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Show excluded items value */}
          {invalidItemsCount > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-gray-600 text-sm text-center">
                {invalidItemsCount} item{invalidItemsCount > 1 ? "s" : ""} excluded from total
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-10 w-10 text-green-600" />
          <div>
            <p className="font-bold text-green-800">
              100% Secure Checkout
            </p>
            <p className="text-sm text-green-700">
              SSL encrypted & PCI compliant
            </p>
          </div>
        </div>
      </div>

      {/* Cart Status Info */}
      {cartValidation && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Cart Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valid Items:</span>
              <span className="font-medium text-green-600">
                {validItemsCount}
              </span>
            </div>
            {invalidItemsCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Issues:</span>
                <span className="font-medium text-red-600">
                  {invalidItemsCount}
                </span>
              </div>
            )}
            <div className="pt-2 border-t">
              <div
                className={`text-sm font-medium ${
                  canProceedToPayment ? "text-green-600" : "text-red-600"
                }`}
              >
                {canProceedToPayment
                  ? "✅ Ready for checkout"
                  : "⚠️ Issues need resolution"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Need Help?
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Having trouble with your order?
          </p>
          <button className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
            Contact Support
          </button>
          <p className="text-xs text-gray-500">
            Available 24/7 to help you
          </p>
        </div>
      </div>

      {/* Loading indicator when validating cart */}
      {isValidatingCart && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
          <div className="flex items-center justify-center space-x-3">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            <span className="text-sm text-gray-600">
              Validating cart...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSidebar;