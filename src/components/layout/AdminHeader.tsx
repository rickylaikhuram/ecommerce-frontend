// components/layout/AdminHeader.tsx
import React from "react";
import { Menu, User, Bell } from "lucide-react";

interface HeaderProps {
  onSidebarToggle: () => void;
  title: string;
}

const AdminHeader: React.FC<HeaderProps> = ({ onSidebarToggle, title }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
        >
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-700">Admin User</div>
            <div className="text-xs text-gray-500">admin@store.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
