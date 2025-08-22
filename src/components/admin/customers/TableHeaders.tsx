// components/TableHeaders.tsx
import React from 'react';
import type{ TabType } from '../../../types/admin/user.types';

interface TableHeadersProps {
  activeTab: TabType;
}

export const TableHeaders: React.FC<TableHeadersProps> = ({ activeTab }) => {
  if (activeTab === 'admins') {
    return (
      <tr className="bg-gray-50">
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Admin Details
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Contact
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Joined
        </th>
      </tr>
    );
  }

  return (
    <tr className="bg-gray-50">
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        User Details
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Contact
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Latest Order
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Joined
      </th>
    </tr>
  );
};
