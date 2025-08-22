// components/EmptyState.tsx
import React from "react";
import type { TabType, TabConfig } from "../../../types/admin/user.types";

interface EmptyStateProps {
  activeTab: TabType;
  currentTab: TabConfig | undefined;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  activeTab,
  currentTab,
}) => (
  <tr>
    <td
      colSpan={activeTab === "admins" ? 3 : 4}
      className="px-6 py-12 text-center text-gray-500"
    >
      <div className="flex flex-col items-center">
        {currentTab && (
          <currentTab.icon className="h-12 w-12 text-gray-300 mb-4" />
        )}
        <p className="text-lg font-medium">No {activeTab} found</p>
        <p className="text-sm">
          There are no {activeTab} to display at the moment.
        </p>
      </div>
    </td>
  </tr>
);
