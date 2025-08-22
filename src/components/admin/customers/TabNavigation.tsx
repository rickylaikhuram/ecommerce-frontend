// components/TabNavigation.tsx
import React from "react";
import type { TabType, TabConfig } from "../../../types/admin/user.types";

interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  data: any[];
  loading: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  data,
  loading,
}) => (
  <div className="mb-6">
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {loading ? "..." : data.length}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  </div>
);
