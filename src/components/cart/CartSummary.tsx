// components/cart/CartSummary.tsx
import React, { useEffect } from "react";
import {
  ShoppingBag,
  Tag,
  Truck,
  CreditCard,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { selectCart } from "../../redux/slice/cart";
import type {
  CartSummary as CartSummaryType,
  CartItem,
} from "../../types/cart.types";
import type { CheckoutState } from "../../types/checkout.types";
import { fetchDeliverySetting } from "../../redux/slice/delivery";

interface CartSummaryProps {
  summary: CartSummaryType;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ summary }) => {
  const dispatch = useAppDispatch();
  const { status, deliverySetting } = useAppSelector((state) => state.delivery);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDeliverySetting());
    }
  }, [status, dispatch]);

  const navigate = useNavigate();

  // Use Redux selector instead of context
  const cart = useAppSelector(selectCart);

  // Calculate shipping cost based on delivery settings
  const calculateShippingCost = () => {
    if (!deliverySetting || !deliverySetting.takeDeliveryFee) {
      return 0;
    }

    if (
      deliverySetting.checkThreshold &&
      deliverySetting.freeDeliveryThreshold
    ) {
      return summary.totalPrice >= Number(deliverySetting.freeDeliveryThreshold)
        ? 0
        : Number(deliverySetting.deliveryFee) || 0;
    }

    return Number(deliverySetting.deliveryFee) || 0;
  };

  const shippingCost = calculateShippingCost();
  const finalTotal = summary.totalPrice + shippingCost;

  // Check if checkout is allowed
  const canCheckout =
    summary.canProceedToCheckout && cart && cart.items.length > 0;
  const hasIssues = summary.overallStatus === "requires_action";

  const handleCheckout = () => {
    if (!canCheckout || !cart) return;

    const checkoutState: CheckoutState = {
      items: cart.items
        .filter((item: CartItem) => item.canProceedToCheckout)
        .map((item: CartItem) => ({
          productId: item.productId,
          productVarient: item.stockName,
          quantity: item.quantity,
        })),
    };

    navigate("/checkout", { state: checkoutState });
  };

  const getCheckoutButtonConfig = () => {
    if (!cart || cart.items.length === 0) {
      return {
        disabled: true,
        text: "Cart is Empty",
        icon: ShoppingBag,
        className: "bg-gray-300 text-gray-500 cursor-not-allowed",
      };
    }

    if (hasIssues) {
      return {
        disabled: true,
        text: "Resolve Cart Issues",
        icon: AlertTriangle,
        className:
          "bg-red-100 text-red-600 cursor-not-allowed border-2 border-red-200",
      };
    }

    if (summary.hasLowStockWarnings) {
      return {
        disabled: false,
        text: "Checkout Now (Limited Stock)",
        icon: CreditCard,
        className: "bg-orange-500 text-white hover:bg-orange-600 animate-pulse",
      };
    }

    return {
      disabled: false,
      text: "Proceed to Checkout",
      icon: CreditCard,
      className: "bg-emerald-600 text-white hover:bg-emerald-700",
    };
  };

  const buttonConfig = getCheckoutButtonConfig();

  // Show loading state while fetching delivery settings
  if (status === "loading") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Cart Issues Warning */}
      {hasIssues && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Issues in Cart</span>
          </div>
          <p className="text-xs text-red-600 mt-1">
            {summary.itemsRequiringAttention} item(s) need attention
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Items */}
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Items ({summary.totalValidItems || summary.totalItems})
          </span>
          <span>₹{summary.totalOriginalPrice}</span>
        </div>

        {/* Discount */}
        {summary.totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Discount
            </span>
            <span>-₹{summary.totalDiscount}</span>
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between font-medium text-gray-900 pb-4 border-b">
          <span>Subtotal</span>
          <span>₹{summary.totalPrice}</span>
        </div>

        {/* Shipping - Always show this section */}
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping
          </span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              `₹${shippingCost}`
            )}
          </span>
        </div>

        {/* Free shipping threshold message - only show if delivery fee is enabled and there's a cost */}
        {deliverySetting?.takeDeliveryFee &&
          deliverySetting?.checkThreshold &&
          shippingCost > 0 &&
          deliverySetting?.freeDeliveryThreshold && (
            <div className="text-xs text-gray-500">
              Add ₹
              {Number(deliverySetting.freeDeliveryThreshold) -
                summary.totalPrice}{" "}
              more for free shipping
            </div>
          )}

        {/* Total */}
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={buttonConfig.disabled}
        className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${buttonConfig.className}`}
      >
        <buttonConfig.icon className="w-5 h-5" />
        {buttonConfig.text}
      </button>

      {/* Status Messages */}
      {hasIssues && (
        <div className="mt-3 text-center">
          <p className="text-xs text-red-600">
            Please resolve cart issues before checkout
          </p>
        </div>
      )}

      {summary.hasLowStockWarnings && !hasIssues && (
        <div className="mt-3 text-center">
          <p className="text-xs text-orange-600">
            Limited stock items - complete purchase soon!
          </p>
        </div>
      )}

      {/* Security Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Secure checkout powered by SSL encryption
        </p>
      </div>

      {/* Quick Actions */}
      {hasIssues && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Quick Actions:</p>
          <div className="space-y-2">
            {summary.hasOutOfStockItems && (
              <div className="text-xs text-gray-600">
                • Remove out-of-stock items
              </div>
            )}
            {summary.hasQuantityIssues && (
              <div className="text-xs text-gray-600">
                • Adjust quantities to available stock
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
