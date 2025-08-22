// components/StatsFooter.tsx
import React from 'react';
import type{ User, Admin, TabType, TabConfig } from '../../../types/admin/user.types';

interface StatsFooterProps {
  data: (User | Admin)[];
  activeTab: TabType;
  currentTab: TabConfig | undefined;
  formatCurrency: (amount: number) => string;
}

export const StatsFooter: React.FC<StatsFooterProps> = ({ 
  data, 
  activeTab, 
  currentTab, 
  formatCurrency 
}) => {
  if (data.length === 0) return null;

  const usersWithOrders = activeTab !== 'admins' 
    ? (data as User[]).filter(item => item.latestOrder).length 
    : 0;

  const totalOrderValue = activeTab !== 'admins' 
    ? (data as User[]).reduce((sum, item) => sum + (item.latestOrder?.totalAmount || 0), 0)
    : 0;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data.length}</div>
          <div className="text-sm text-gray-500">Total {currentTab?.label}</div>
        </div>
        {activeTab !== 'admins' && (
          <>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{usersWithOrders}</div>
              <div className="text-sm text-gray-500">With Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalOrderValue)}
              </div>
              <div className="text-sm text-gray-500">Total Latest Order Value</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
