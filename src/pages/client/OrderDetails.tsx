import React, { useState, useEffect } from "react";
import { orderService } from "../../services/order.services";
import WarningModal from "../../components/common/WarningModal";
import { useNavigate } from "react-router-dom";
import type { OrderDetails as OrderDetailsType } from "../../types/order.types";


const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

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

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  // Get orderId from URL - you can replace this with your router's useParams
  const getOrderIdFromUrl = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  };

  const [orderId] = useState(getOrderIdFromUrl());
  const [order, setOrder] = useState<OrderDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const handleBackToOrders = () => {
    navigate("/account/orders");
  };

  const handleProductClick = (productId: string | null) => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelLoading(true);
      const response = await orderService.cancelOrder(order.id);
      if (response.success) {
        setOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
        setShowCancelModal(false);
        alert("Order cancelled successfully");
      }
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "PENDING":
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case "PROCESSING":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "SHIPPED":
        return `${baseClass} bg-purple-100 text-purple-800`;
      case "DELIVERED":
        return `${baseClass} bg-green-100 text-green-800`;
      case "CANCELLED":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Your order is being processed and will be confirmed soon.";
      case "PROCESSING":
        return "Your order is being prepared for shipment.";
      case "SHIPPED":
        return "Your order is on the way to your delivery address.";
      case "DELIVERED":
        return "Your order has been successfully delivered.";
      case "CANCELLED":
        return "This order has been cancelled.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The requested order could not be found."}
            </p>
            <button
              onClick={handleBackToOrders}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToOrders}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Orders
          </button>
          <button className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Invoice
          </button>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 mb-3">
                Placed on{" "}
                {order.createdAt.toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="flex items-center gap-3 mb-3">
                <span className={getStatusBadge(order.status)}>
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {getStatusMessage(order.status)}
              </p>
            </div>
            <div className="mt-4 lg:mt-0 text-right">
              <p className="text-3xl font-bold text-gray-900">
                ₹{convertToNumber(order.totalAmount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>

          {/* Action Buttons */}
          {(order.status === "PENDING" || order.status === "CONFIRMED") && (
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.orderItems.length})
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors cursor-pointer"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    {item.productImageUrl && (
                      <img
                        src={`${S3_BASE_URL}${item.productImageUrl}`}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      {item.productDescription && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.productDescription}
                        </p>
                      )}
                      {item.productCategory && (
                        <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-2">
                          {item.productCategory}
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{convertToNumber(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Details & Payment */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.shippingFullName}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingPhone}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingLine1}</p>
                  {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                  <p>
                    {order.shippingCity}, {order.shippingState}{" "}
                    {order.shippingZipCode}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Details
              </h2>
              {order.payment ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {order.payment.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.payment.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.payment.status.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.payment.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">Cash on Delivery</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Payment will be collected upon delivery
                  </p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Price Details
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({order.orderItems.length} items):
                  </span>
                  <span className="text-gray-900">
                    ₹
                    {order.orderItems
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Modal using WarningModal */}
        <WarningModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Order"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={cancelLoading}
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </WarningModal>
      </div>
    </div>
  );
};

export default OrderDetails;
