// components/StatusBadge.tsx
import React from 'react';
import type { Order } from '../../../types/admin/user.types';

interface StatusBadgeProps {
  status: Order['status'] | undefined;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors: Record<Order['status'], string> = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
    'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
    'delivered': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const colorClass = status ? statusColors[status] : 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      {status || 'N/A'}
    </span>
  );
};