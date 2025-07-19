// pages/Orders.tsx
import React, { useState } from 'react';
import { FaBox, FaTruck, FaCheck, FaTimes } from 'react-icons/fa';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

const Orders: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: 3
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 149.99,
      items: 1
    }
  ]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <FaBox className="w-5 h-5" />;
      case 'processing':
        return <FaBox className="w-5 h-5" />;
      case 'shipped':
        return <FaTruck className="w-5 h-5" />;
      case 'delivered':
        return <FaCheck className="w-5 h-5" />;
      case 'cancelled':
        return <FaTimes className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Ordered on {new Date(order.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {order.items} {order.items === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
                <button className="mt-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;