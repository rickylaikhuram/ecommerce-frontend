// components/admin/userDetail/UserDetailModal.tsx
import React, { useState, useEffect } from "react";
import { X, User, Package, MapPin, Heart, ShoppingCart } from "lucide-react";
import type {
  UserDetailTab,
  UserDetailTabConfig,
} from "../../../types/admin/userDetail.types";
import { useUserDetail } from "../../../hooks/admin/useUserDetail";
import { formatDate, formatCurrency } from "../../../utils/admin/formatters";
import { UserProfileTab } from "./UserProfileTab";
import { UserOrdersTab } from "./UserOrdersTab";
import { UserAddressesTab } from "./UserAddressesTab";
import { UserWishlistTab } from "./UserWishlistTab";
import { UserCartTab } from "./UserCartTab";

interface UserDetailModalProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  userId,
  userName,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<UserDetailTab>("profile");
  const {
    profile,
    orders,
    addresses,
    wishlist,
    cart,
    loading,
    error,
    fetchUserData,
  } = useUserDetail();

  const tabs: UserDetailTabConfig[] = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "Orders", icon: Package },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "cart", label: "Cart", icon: ShoppingCart },
  ];

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData(userId, activeTab);
    }
  }, [isOpen, userId, activeTab, fetchUserData]);

  if (!isOpen) return null;

  const renderTabContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 mb-6 text-center max-w-md">{error}</p>
          <button
            onClick={() => fetchUserData(userId, activeTab)}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <UserProfileTab
            profile={profile}
            loading={loading}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        );
      case "orders":
        return (
          <UserOrdersTab
            orders={orders}
            loading={loading}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        );
      case "addresses":
        return (
          <UserAddressesTab
            addresses={addresses}
            loading={loading}
            formatDate={formatDate}
          />
        );
      case "wishlist":
        return (
          <UserWishlistTab
            wishlist={wishlist}
            loading={loading}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        );
      case "cart":
        return (
          <UserCartTab
            cart={cart}
            loading={loading}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {userName}
                </h1>
                <p className="text-sm text-gray-500">User ID: {userId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <X className="h-5 w-5" />
              <span className="font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Modern Tab Navigation */}
          <div className="border-b border-gray-100">
            <nav className="flex px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="min-h-[600px]">
            <div className="p-8">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
