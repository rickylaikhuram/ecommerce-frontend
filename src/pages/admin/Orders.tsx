import React, { useState, useEffect } from "react";
import {
  Eye,
  Package,
  Calendar,
  User,
  Truck,
  Mail,
  Phone,
  MapPin,
  Home,
} from "lucide-react";
import WarningModal from "../../components/common/WarningModal"; // Import your existing modal component
import instance from "../../utils/axios"; // Import your axios instance

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

// Order status constants
const OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  UNPLACED: "UNPLACED",
} as const;

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

// Status color mapping
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.CONFIRMED:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.SHIPPED:
      return "bg-purple-100 text-purple-800";
    case OrderStatus.DELIVERED:
      return "bg-green-100 text-green-800";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    case OrderStatus.UNPLACED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  _count: {
    orderItems: number;
  };
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  _count: {
    orderItems: number;
  };
  // Customer info snapshot
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // Shipping address snapshot
  shippingFullName: string;
  shippingPhone: string;
  shippingPhone2?: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingLandmark?: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingZipCode: string;
  orderItems: Array<{
    id: string;
    orderId: string;
    productId: string;
    stockName: string;
    quantity: number;
    price: number;
    subTotal: number;
    productName: string;
    product: {
      images: Array<{
        imageUrl: string;
      }>;
    };
  }>;
  payment: {
    id: string;
    method: string;
    transactionId: string;
    status: string;
    paidAt: string;
    updatedAt: string;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Fetch all orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await instance.get("/admin/orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    setDetailsLoading(true);
    try {
      const response = await instance.get(`/admin/orders/${orderId}`);
      setSelectedOrder(response.data.order);
      setSelectedStatus(response.data.order.status);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !selectedStatus) return;

    setUpdating(true);
    try {
      await instance.patch(`/admin/orders/${selectedOrder.id}`, {
        status: selectedStatus,
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: selectedStatus as OrderStatus }
            : order
        )
      );

      setSelectedOrder({
        ...selectedOrder,
        status: selectedStatus as OrderStatus,
      });

      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
    setSelectedStatus("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track all customer orders
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 font-mono text-sm text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {order.userId.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {order._count.orderItems} items
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => fetchOrderDetails(order.id)}
                        disabled={detailsLoading}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <WarningModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        title={
          selectedOrder
            ? `Order #${
                selectedOrder.orderNumber ||
                selectedOrder.id.slice(-8).toUpperCase()
              }`
            : ""
        }
        size="xl"
      >
        {detailsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : selectedOrder ? (
          <div className="space-y-8 max-h-[80vh] overflow-y-auto">
            {/* Order Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Order Date
                </p>
                <p className="text-sm text-blue-800 font-medium">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Items Count
                </p>
                <p className="text-sm text-blue-800 font-medium">
                  {selectedOrder._count.orderItems} items
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Last Updated
                </p>
                <p className="text-sm text-blue-800 font-medium">
                  {formatDate(selectedOrder.updatedAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Full Name
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedOrder.customerName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Email Address
                      </p>
                      <p className="text-gray-900 font-medium break-all">
                        {selectedOrder.customerEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedOrder.customerPhone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Recipient
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedOrder.shippingFullName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Contact
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedOrder.shippingPhone || "N/A"}
                         {selectedOrder.shippingPhone2 && (
                          <p>Alternate - {selectedOrder.shippingPhone2}</p>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Complete Address
                      </p>
                      <div className="text-gray-900 space-y-1">
                        <p className="font-medium">
                          {selectedOrder.shippingLine1 || "N/A"}
                        </p>
                        {selectedOrder.shippingLine2 && (
                          <p>{selectedOrder.shippingLine2}</p>
                        )}
                        {selectedOrder.shippingLandmark && (
                          <p>Landmark - {selectedOrder.shippingLandmark}</p>
                        )}
                        <p>
                          {selectedOrder.shippingCity || "N/A"},{" "}
                          {selectedOrder.shippingState || "N/A"}{" "}
                          {selectedOrder.shippingZipCode || ""}
                        </p>
                        <p className="font-medium text-blue-700">
                          {selectedOrder.shippingCountry || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items ({selectedOrder._count.orderItems})
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                    >
                      {item.product.images[0] && (
                        <img
                          src={
                            `${S3_BASE_URL}${item.product.images[0].imageUrl}` ||
                            ""
                          }
                          alt={item.productName}
                          className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">
                          {item.productName}
                        </p>
                        <p className="text-blue-600 font-medium">
                          Size: {item.stockName}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Quantity
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Unit Price
                        </p>
                        <p className="text-sm text-gray-700 font-medium">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Subtotal
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(item.subTotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {selectedOrder.payment && (
              <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Payment Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        Payment Method
                      </p>
                      <p className="font-bold text-blue-900 text-lg">
                        {selectedOrder.payment.method}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        Transaction ID
                      </p>
                      <p className="font-mono text-sm text-blue-800 break-all">
                        {selectedOrder.payment.transactionId || "Not Available"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        Payment Status
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedOrder.payment.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedOrder.payment.status}
                      </span>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        Paid At
                      </p>
                      <p className="text-sm text-blue-800 font-medium">
                        {selectedOrder.payment.paidAt
                          ? formatDate(selectedOrder.payment.paidAt)
                          : "Not Paid"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Update Section */}
            <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">
                  Update Order Status
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between space-x-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      Current Status
                    </p>
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      Change To
                    </p>
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value as OrderStatus)
                      }
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select Status</option>
                      {Object.values(OrderStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 flex justify-end">
                    {selectedStatus &&
                      selectedStatus !== selectedOrder.status && (
                        <button
                          onClick={openConfirmModal}
                          disabled={updating}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center font-medium"
                        >
                          <Truck className="h-5 w-5 mr-2" />
                          {updating ? "Updating..." : "Update Status"}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </WarningModal>

      {/* Confirmation Modal - Stacked on top */}
      <WarningModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title="Confirm Status Update"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to update the order status from{" "}
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                selectedOrder ? getStatusColor(selectedOrder.status) : ""
              }`}
            >
              {selectedOrder?.status}
            </span>{" "}
            to{" "}
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                selectedStatus
                  ? getStatusColor(selectedStatus as OrderStatus)
                  : ""
              }`}
            >
              {selectedStatus}
            </span>
            ?
          </p>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={closeConfirmModal}
              disabled={updating}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Confirm Update"
              )}
            </button>
          </div>
        </div>
      </WarningModal>
    </div>
  );
};

export default Orders;
