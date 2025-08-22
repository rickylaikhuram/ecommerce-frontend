// components/OrderInfo.tsx
import React from "react";
import { Package, DollarSign } from "lucide-react";
import type { Order } from "../../../types/admin/user.types";
import { StatusBadge } from "./StatusBadge";

interface OrderInfoProps {
  order: Order | null;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({
  order,
  formatCurrency,
  formatDate,
}) => {
  if (!order) {
    return <div className="text-sm text-gray-500 italic">No orders</div>;
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-900">
          <Package className="h-4 w-4 mr-2 text-gray-400" />#{order.id}
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-green-600">
          <DollarSign className="h-4 w-4 mr-1" />
          {formatCurrency(order.totalAmount)}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(order.createdAt)}
        </div>
      </div>
    </div>
  );
};
