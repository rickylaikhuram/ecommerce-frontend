// components/admin/userDetail/UserAddressesTab.tsx
import React from "react";
import { MapPin, Home, Building, Star } from "lucide-react";
import type { UserAddress } from "../../../types/admin/userDetail.types";

interface UserAddressesTabProps {
  addresses: UserAddress[];
  loading: boolean;
  formatDate: (date: string) => string;
}

export const UserAddressesTab: React.FC<UserAddressesTabProps> = ({
  addresses,
  loading,
  formatDate,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No addresses found</p>
      </div>
    );
  }

  const getAddressIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home":
        return Home;
      case "work":
        return Building;
      default:
        return MapPin;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((address) => {
        const Icon = getAddressIcon(address.label);
        return (
          <div
            key={address.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{address.label}</p>
                  <p className="text-sm text-gray-500">{address.fullName}</p>
                </div>
              </div>
              {address.isDefault && (
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              {address.landmark && <p>Near {address.landmark}</p>}
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Phone: {address.phone}</span>
                <span>Added: {formatDate(address.createdAt)}</span>
              </div>
              {address.alternatePhone && (
                <p className="text-sm text-gray-500 mt-1">
                  Alt: {address.alternatePhone}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
