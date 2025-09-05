import React, { useState, useEffect } from "react";
import { orderService } from "../../services/order.services";
import { useNavigate } from "react-router-dom";

// Updated interfaces to match your backend structure
interface Order {
  id: string;
  createdAt: Date;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  payment: {
    status: string;
    method: string;
  };
  orderNumber?: string;
  items?: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
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
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

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

  // const handleCancelOrder = async (
  //   orderId: string,
  //   event: React.MouseEvent
  // ) => {
  //   event.stopPropagation();
  //   if (!confirm("Are you sure you want to cancel this order?")) return;

  //   try {
  //     setActionLoading(orderId);
  //     const response = await orderService.cancelOrder(orderId);
  //     if (response.success) {
  //       setOrders((prev) =>
  //         prev.map((order) =>
  //           order.id === orderId
  //             ? { ...order, status: "CANCELLED" as const }
  //             : order
  //         )
  //       );
  //       setError(null);
  //       alert("Order cancelled successfully");
  //     }
  //   } catch (err: any) {
  //     setError(err.message || "Failed to cancel order");
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  const getStatusBadge = (status: Order["status"]) => {
    const baseClass =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
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
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const baseClass =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
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

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.status === filter
  );

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

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(
                [
                  "all",
                  "PENDING",
                  "CONFIRMED",
                  "SHIPPED",
                  "DELIVERED",
                  "CANCELLED",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === status
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {status === "all"
                    ? "All Orders"
                    : status.charAt(0) + status.slice(1).toLowerCase()}
                  {status !== "all" && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {orders.filter((o) => o.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
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
                {filter === "all"
                  ? "You haven't placed any orders yet."
                  : `No ${filter.toLowerCase()} orders found.`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-colors cursor-pointer"
                onClick={() => handleOrderClick(order.id)}
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #
                          {order.orderNumber ||
                            order.id.slice(-8).toUpperCase()}
                        </h3>
                        <div className="flex gap-2">
                          <span className={getStatusBadge(order.status)}>
                            {order.status.charAt(0) +
                              order.status.slice(1).toLowerCase()}
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

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          Placed on{" "}
                          {order.createdAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>Payment Method: {order.payment.method}</p>
                        {order.items && (
                          <p>
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ₹{convertToNumber(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 truncate">
                                {item.productName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-gray-900">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
