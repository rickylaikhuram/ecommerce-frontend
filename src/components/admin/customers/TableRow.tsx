// components/admin/customers/TableRow.tsx
import React from 'react';
import type{ User, Admin, TabType } from '../../../types/admin/user.types';
import { UserAvatar } from './UserAvatar';
import { ContactInfo } from './ContactInfo';
import { OrderInfo } from './OrderInfo';
import { DateInfo } from './DateInfo';

interface TableRowProps {
  item: User | Admin;
  index: number;
  activeTab: TabType;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  onUserClick: (userId: string, userName: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ 
  item, 
  index, 
  activeTab, 
  formatCurrency, 
  formatDate,
  onUserClick 
}) => {
  const isAdmin = activeTab === 'admins';
  const user = item as User;

  const handleRowClick = () => {
    onUserClick(item.id, item.name);
  };

  return (
    <tr 
      key={item.id} 
      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors cursor-pointer`}
      onClick={handleRowClick}
    >
      {/* User Details */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <UserAvatar isAdmin={isAdmin} />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 hover:text-blue-600">{item.name}</div>
            <div className="text-sm text-gray-500">ID: {item.id}</div>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <ContactInfo email={item.email} phone={item.phone} />
      </td>

      {/* Order Info (only for users/customers) */}
      {!isAdmin && (
        <td className="px-6 py-4 whitespace-nowrap">
          <OrderInfo 
            order={user.latestOrder} 
            formatCurrency={formatCurrency} 
            formatDate={formatDate} 
          />
        </td>
      )}

      {/* Join Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <DateInfo date={item.createdAt} formatDate={formatDate} />
      </td>
    </tr>
  );
};