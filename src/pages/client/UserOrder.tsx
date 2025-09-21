import React, { useState, useEffect } from "react";
import { orderService } from "../../services/order.services";
import { useNavigate } from "react-router-dom";
// order": [
//         {
//             "id": "a5e0b60a-58a6-43c6-b272-03e6169f2df0",
//             "orderNumber": "ORD-20250921-MFTDIAI4Z97",
//             "status": "PENDING",
//             "createdAt": "2025-09-21T07:25:52.686Z",
//             "orderItems": [
//                 {
//                     "stockName": "A",
//                     "price": "1099",
//                     "productName": "dsfdsfdsfds",
//                     "productImageUrl": "products/images/1758433418544-wallhaven-rd92qj1920x1080.png",
//                     "productDescription": "fdsfdsfdsfs dfdsfdsf dsfds fdsf dsf dsfdss",
//                     "productCategory": "Arsenal"
//                 }
//             ]
//         }
//     ]
interface Order {
  id: string;
  orderNumber?: string;
  createdAt: Date;
  totalAmount: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "UNPLACED";
  orderItems: OrderItems[];
}

interface OrderItems {
  productId: string;
  stockName: string;
  price: string;
  productName: string;
  productImageUrl: string;
  productDescription: string;
  productCategory: string;
}
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
    <div className="min-h-screen bg-white">
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
                {order.orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-1"
                  >
                    <div className="flex items-start p-4 border-b border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                      {item.productImageUrl && (
                        <img
                          src={`${S3_BASE_URL}${item.productImageUrl}`}
                          alt={item.productName}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mr-4 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.productName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Order:
                            </span>
                            <span className={getOrderStatusBadge(order.status)}>
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {item.productCategory && (
                            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {item.productCategory}
                            </span>
                          )}
                          {item.stockName && (
                            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Size: {item.stockName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            ₹{convertToNumber(item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-6 pt-1 pb-6">
                  <div className="pt-4">
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
