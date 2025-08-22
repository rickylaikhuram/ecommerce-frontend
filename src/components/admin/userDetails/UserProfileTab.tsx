// components/admin/userDetail/UserProfileTab.tsx
import React from 'react';
import { User, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import type { UserProfile } from '../../../types/admin/userDetail.types';

interface UserProfileTabProps {
  profile: UserProfile | null;
  loading: boolean;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export const UserProfileTab: React.FC<UserProfileTabProps> = ({ 
  profile, 
  loading, 
  formatDate,
  formatCurrency 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 bg-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-blue-100">User ID: {profile.id}</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Joined</p>
                <p className="text-gray-900">{formatDate(profile.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Order */}
      {profile.orders && profile.orders.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Latest Order</h3>
          </div>
          <div className="p-6">
            {profile.orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
