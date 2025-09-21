import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/order.services";
import type { OrderDetails } from "../../types/order.types";

// Helper function to safely convert Decimal to number
const convertToNumber = (value: any): number => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return parseFloat(value);
  }
  if (value && typeof value === "object") {
    // Handle Prisma Decimal objects
    if (typeof value.toNumber === "function") {
      return value.toNumber();
    }
    if (typeof value.toString === "function") {
      return parseFloat(value.toString());
    }
  }
  return 0; // Fallback value
};

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();

  // Get orderId from URL
  const getOrderIdFromUrl = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  const [orderId] = useState(getOrderIdFromUrl());
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderDetails(orderId!);
      if (response.success && response.orderDetails) {
        const orderData = {
          ...response.orderDetails,
          createdAt: new Date(response.orderDetails.createdAt),
          totalAmount: convertToNumber(response.orderDetails.totalAmount),
          orderItems: response.orderDetails.orderItems.map((item: any) => ({
            ...item,
            price: convertToNumber(item.price),
          })),
          payment: response.orderDetails.payment
            ? {
                ...response.orderDetails.payment,
              }
            : null,
        };
        setOrder(orderData);
      } else {
        setError("Order not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = () => {
    navigate(`/orders/${orderId}`);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load order confirmation."}
          </p>
          <button
            onClick={handleContinueShopping}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 py-8 sm:py-12">
        {/* Success Icon */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-4">
            Thank You for Your Purchase!
          </h1>
          <p className="text-gray-600 px-4">
            Your order has been successfully placed and is being processed.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Order #{order.id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Order Date</p>
                <p className="font-medium text-gray-900">
                  {order.createdAt.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Payment Method</p>
                <p className="font-medium text-gray-900 capitalize">
                  {order.payment ? order.payment.method : "Cash on Delivery"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Items Ordered</p>
                <p className="font-medium text-gray-900">
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Delivery To</p>
                <p className="font-medium text-gray-900">
                  {order.shippingCity}, {order.shippingState}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex  gap-3 mb-6">
          <button
            onClick={handleViewOrderDetails}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            View Order Details
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full px-6 py-3 text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>

        {/* Order Items Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary ({order.orderItems.length} items)
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start p-3 sm:p-4 border border-gray-100 rounded-lg"
              >
                {item.productImageUrl && (
                  <img
                    src={`${import.meta.env.VITE_S3_BASE_URL}${
                      item.productImageUrl
                    }`}
                    alt={item.productName}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg mr-3 sm:mr-4 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {item.productName}
                  </h4>
                  {item.productCategory && (
                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1">
                      {item.productCategory}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Qty: {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      ₹
                      {(convertToNumber(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({order.orderItems.length} items):
                </span>
                <span className="text-gray-900">
                  ₹
                  {order.orderItems
                    .reduce(
                      (sum, item) =>
                        sum + convertToNumber(item.price) * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="text-gray-900">Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-base sm:text-lg">
                <span>Total Amount:</span>
                <span className="text-emerald-600">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-2 px-4">
            Need help with your order?
          </p>
          <p className="text-emerald-600 text-sm px-4">
            Contact our support team at{" "}
            <a
              href="mailto:support@cloverarena.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              support@cloverarena.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
