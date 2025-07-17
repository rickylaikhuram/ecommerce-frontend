// components/layout/AdminSidebar.tsx
import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  HelpCircle,
  TrendingUp,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import useLogout from "../../hooks/useLogout";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onToggle,
}) => {
  const logout = useLogout;
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "3" },
    { id: "support", label: "Support", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Fixed height on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-white">AdminHub</span>
              <p className="text-xs text-slate-400">Control Panel</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-all duration-200"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-6 border-b border-slate-800">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-slate-900 font-semibold text-lg">JD</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-white font-medium">John Doe</p>
              <p className="text-slate-400 text-sm">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full" />
                  )}
                  
                  <Icon className={`w-5 h-5 mr-3 ${
                    activeTab === item.id 
                      ? "text-white" 
                      : "text-slate-500 group-hover:text-slate-300"
                  }`} />
                  
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  
                  {item.badge && (
                    <span className="bg-amber-500 text-slate-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section - Fixed at bottom */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <p className="text-white text-sm font-medium mb-1">Need Help?</p>
            <p className="text-slate-400 text-xs mb-3">Check our documentation</p>
            <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200">
              View Docs
            </button>
          </div>
          
          <button onClick={logout} className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group">
            <LogOut className="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;