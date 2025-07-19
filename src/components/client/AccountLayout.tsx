// components/AccountLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../pages/client/UserSidebar';

const AccountLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <UserSidebar />
          </div>
          <div className="md:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;