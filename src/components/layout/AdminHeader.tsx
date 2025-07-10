import React from 'react';
import { Menu, User, LogOut, Search } from 'lucide-react';
import useLogout from "../../hooks/useLogout";

interface HeaderProps {
  onSidebarToggle: () => void;
  title: string;
}
const AdminHeader: React.FC<HeaderProps> = ({ onSidebarToggle, title }) => {
  const logout = useLogout(); // ✅ Call the hook here
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button 
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
        >
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-700">Admin User</div>
            <div className="text-xs text-gray-500">admin@store.com</div>
          </div>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;