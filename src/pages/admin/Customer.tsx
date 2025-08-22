// Customers.tsx
import React, { useState, useEffect } from "react";
import { Users, ShoppingBag, Shield } from "lucide-react";
import type { TabType, TabConfig } from "../../types/admin/user.types";
import { useUserData } from "../../hooks/admin/useUserData";
import { formatDate, formatCurrency } from "../../utils/admin/formatters";
import { TabNavigation } from "../../components/admin/customers/TabNavigation";
import { TableHeaders } from "../../components/admin/customers/TableHeaders";
import { TableRow } from "../../components/admin/customers/TableRow";
import { EmptyState } from "../../components/admin/customers/EmptyState";
import { StatsFooter } from "../../components/admin/customers/StatsFooter";
import { UserDetailModal } from "../../components/admin/userDetails/UserDetailModal";

const Customers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { data, loading, error, fetchData } = useUserData();

  const tabs: TabConfig[] = [
    { key: "users", label: "Users", icon: Users, endpoint: "/api/admin/users" },
    {
      key: "customers",
      label: "Customers",
      icon: ShoppingBag,
      endpoint: "/api/admin/customers",
    },
    {
      key: "admins",
      label: "Admins",
      icon: Shield,
      endpoint: "/api/admin/admins",
    },
  ];

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.key === activeTab);
    if (currentTab) {
      fetchData(currentTab.endpoint, activeTab);
    }
  }, [activeTab, fetchData]);

  const currentTab = tabs.find((tab) => tab.key === activeTab);

  const handleRefresh = (): void => {
    if (currentTab) {
      fetchData(currentTab.endpoint, activeTab);
    }
  };

  const handleUserClick = (userId: string, userName: string): void => {
    setSelectedUser({ id: userId, name: userName });
  };

  const handleCloseModal = (): void => {
    setSelectedUser(null);
  };

  // If a user is selected, show only the modal
  if (selectedUser) {
    return (
      <UserDetailModal
        userId={selectedUser.id}
        userName={selectedUser.name}
        isOpen={true}
        onClose={handleCloseModal}
      />
    );
  }

  // Otherwise, show the main customers page
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage users, customers, and administrators
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={data}
          loading={loading}
        />

        {/* Content */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                {currentTab && <currentTab.icon className="h-5 w-5 mr-2" />}
                {currentTab?.label} ({data.length})
              </h2>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading {activeTab}...</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <TableHeaders activeTab={activeTab} />
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <TableRow
                        key={item.id}
                        item={item}
                        index={index}
                        activeTab={activeTab}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        onUserClick={handleUserClick}
                      />
                    ))
                  ) : (
                    <EmptyState activeTab={activeTab} currentTab={currentTab} />
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {!loading && !error && (
          <StatsFooter
            data={data}
            activeTab={activeTab}
            currentTab={currentTab}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  );
};

export default Customers;
