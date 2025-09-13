import React, { useState, useEffect } from "react";
import { orderService } from "../../services/order.services";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  createdAt: Date;
  totalAmount: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "UNPLACED";
  payment: {
    status: string;
    method: string;
  };
  orderNumber?: string;
}

// Helper function to safely convert Decimal to number
const convertToNumber = (value: any): number => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return parseFloat(value);
  }
  if (value && typeof value === "object") {
    if (typeof value.toNumber === "function") {
      return value.toNumber();
    }
    if (typeof value.toString === "function") {
      return parseFloat(value.toString());
    }
  }
  return 0;
};

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderHistory();
      if (response.success) {
        const transformedOrders = response.order.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          totalAmount: convertToNumber(order.totalAmount),
        }));
        setOrders(transformedOrders);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const getOrderStatusBadge = (status: Order["status"]) => {
    const baseClass =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "PENDING":
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case "CONFIRMED":
        return `${baseClass} bg-emerald-100 text-emerald-800`;
      case "SHIPPED":
        return `${baseClass} bg-purple-100 text-purple-800`;
      case "DELIVERED":
        return `${baseClass} bg-green-100 text-green-800`;
      case "CANCELLED":
        return `${baseClass} bg-red-100 text-red-800`;
      case "UNPLACED":
        return `${baseClass} bg-gray-100 text-gray-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const baseClass =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return `${baseClass} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case "failed":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const getOrderStatusText = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "CONFIRMED":
        return "Confirmed";
      case "SHIPPED":
        return "Shipped";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      case "UNPLACED":
        return "Not Placed";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage your order history</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                You haven't placed any orders yet.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleOrderClick(order.id)}
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Order{" "}
                          {order.orderNumber ||
                            `#${order.id.slice(-8).toUpperCase()}`}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Order:
                            </span>
                            <span className={getOrderStatusBadge(order.status)}>
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Payment:
                            </span>
                            <span
                              className={getPaymentStatusBadge(
                                order.payment.status
                              )}
                            >
                              {order.payment.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          Placed on{" "}
                          {order.createdAt.toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p>Payment Method: {order.payment.method}</p>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Total Amount</p>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Click to view order details
                      </span>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More or Pagination can be added here if needed */}
        {orders.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
