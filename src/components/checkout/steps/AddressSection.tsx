// components/checkout/AddressSection.tsx
import React, { useState } from "react";
import type { Address } from "../../../types/user.types";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Home,
  Briefcase,
  Building2,
  MapPin,
  Phone,
  Edit3,
  Check,
} from "lucide-react";
import AddressForm from "../../common/AddressForm";
import addressService from "../../../services/address.services";

interface AddressSectionProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddAddress: () => void;
  onEditAddress: (address: Address) => void;
  onAddressUpdated?: (savedAddress?: Address) => void; 
  isLoading?: boolean;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onAddressUpdated,
  isLoading = false,
}) => {
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressIcon = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "home":
        return <Home className="h-3 w-3 text-blue-600" />;
      case "office":
      case "work":
        return <Briefcase className="h-3 w-3 text-blue-600" />;
      default:
        return <Building2 className="h-3 w-3 text-blue-600" />;
    }
  };

  const getAddressBadgeColor = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "home":
        return "bg-green-100 text-green-700";
      case "office":
      case "work":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const handleAddNewAddress = () => {
    setShowAddForm(true);
    setEditingAddress(null);
    setError(null);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setError(null);
  };

  const handleSaveAddress = async (
    data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    setIsSaving(true);
    setError(null);

    try {
      let savedAddress: Address;

      if (editingAddress) {
        // Update existing address
        await addressService.updateAddress(editingAddress.id, {
          fullName: data.fullName,
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          line1: data.line1,
          line2: data.line2,
          landmark: data.landmark,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          label: data.label,
          isDefault: data.isDefault,
        });

        // Create the updated address object to pass back
        savedAddress = { ...editingAddress, ...data };
      } else {
        // Create new address
        savedAddress = await addressService.createAddress({
          fullName: data.fullName,
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          line1: data.line1,
          line2: data.line2,
          landmark: data.landmark,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          label: data.label,
          isDefault: data.isDefault,
        });
      }

      setShowAddForm(false);
      setEditingAddress(null);

      // Call the callback with the saved address so it gets selected
      if (onAddressUpdated) {
        onAddressUpdated(savedAddress);
      }
    } catch (error: any) {
      console.error("Error saving address:", error);
      setError(
        error.response?.data?.message ||
          "Failed to save address. Please try again."
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-7 h-7 bg-white text-blue-600 rounded-full text-sm font-bold">
              2
            </span>
            <h3 className="text-sm font-medium uppercase tracking-wide">
              DELIVERY ADDRESS
            </h3>
          </div>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Blue Header */}
      <div className="bg-blue-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-7 h-7 bg-white text-blue-600 rounded-full text-sm font-bold">
            2
          </span>
          <h3 className="text-sm font-medium uppercase tracking-wide">
            DELIVERY ADDRESS
          </h3>
        </div>
      </div>

      <div className="p-4">
        {/* Error message */}
        {error && !showAddForm && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Show form if adding/editing */}
        {showAddForm ? (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-base font-semibold mb-3 text-gray-900">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h4>
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleSaveAddress}
              onCancel={handleCancel}
              submitButtonText="SAVE AND DELIVER HERE"
              cancelButtonText="CANCEL"
            />
          </div>
        ) : (
          <>
            {/* Check if there are any addresses */}
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  No addresses found
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Add your first delivery address to continue
                </p>
                <button
                  onClick={handleAddNewAddress}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Address</span>
                </button>
              </div>
            ) : (
              <>
                {/* All addresses in their original order */}
                <div className="space-y-3">
                  {addresses
                    .slice(0, showAllAddresses ? undefined : 3)
                    .map((address) => (
                      <div
                        key={address.id}
                        className={`relative p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedAddress?.id === address.id
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                        onClick={() => onSelectAddress(address)}
                      >
                        {/* Selected indicator */}
                        {selectedAddress?.id === address.id && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}

                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            checked={selectedAddress?.id === address.id}
                            className="mt-1 text-blue-600"
                            onChange={() => onSelectAddress(address)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-semibold text-gray-900 text-sm">
                                {address.fullName}
                              </h5>
                              {address.isDefault && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">
                                  DEFAULT
                                </span>
                              )}
                              {address.label && (
                                <span
                                  className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded font-medium ${getAddressBadgeColor(
                                    address.label
                                  )}`}
                                >
                                  {getAddressIcon(address.label)}
                                  <span>{address.label.toUpperCase()}</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 mb-1 text-blue-600">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs font-medium">
                                {address.phone}
                              </span>
                            </div>

                            <div className="flex items-start space-x-2 text-gray-600">
                              <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <div className="text-xs">
                                <p>
                                  {address.line1}
                                  {address.line2 && `, ${address.line2}`}
                                </p>
                                <p>
                                  {address.city}, {address.state} -{" "}
                                  <span className="font-semibold">
                                    {address.zipCode}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(address);
                            }}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs bg-white px-2 py-1 rounded border hover:shadow-sm transition-all"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>EDIT</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {addresses.length > 3 && (
                  <button
                    onClick={() => setShowAllAddresses(!showAllAddresses)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-3 font-medium hover:underline transition-colors text-sm"
                  >
                    {showAllAddresses ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span>Show fewer addresses</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>View all {addresses.length} addresses</span>
                      </>
                    )}
                  </button>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={handleAddNewAddress}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add a new address</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddressSection;
