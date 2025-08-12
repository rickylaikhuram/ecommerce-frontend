// pages/Addresses.tsx
import React, { useState, useEffect } from "react";
import { Plus, MoreVertical, Edit2, Trash2, MapPin } from "lucide-react";
import AddressForm from "../../components/common/AddressForm";
import WarningModal from "../../components/common/WarningModal";
import type { CreateAddressPayload } from "../../services/address.services";
import addressService from "../../services/address.services";
import type { Address } from "../../types/user.types"; // Update this import path based on your structure

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const fetchedAddresses = await addressService.getAddresses();
      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (
    data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      const editingAddress = addresses.find((a) => a.id === editingAddressId);

      if (editingAddress) {
        // Update existing address
        const payload: Partial<CreateAddressPayload> = {
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
        };

        const updatedAddress = await addressService.updateAddress(
          editingAddress.id,
          payload
        );

        // If the updated address is set as default, update other addresses
        if (updatedAddress.isDefault) {
          setAddresses(
            addresses.map((a) =>
              a.id === updatedAddress.id
                ? updatedAddress
                : { ...a, isDefault: false }
            )
          );
        } else {
          setAddresses(
            addresses.map((a) =>
              a.id === updatedAddress.id ? updatedAddress : a
            )
          );
        }

        setEditingAddressId(null);
      } else {
        // Create new address
        const payload: CreateAddressPayload = {
          fullName: data.fullName,
          phone: data.phone,
          alternatePhone: data.alternatePhone || "",
          line1: data.line1,
          line2: data.line2 || "",
          landmark: data.landmark || "",
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          label: data.label,
          isDefault: data.isDefault,
        };

        const newAddress = await addressService.createAddress(payload);

        // If the new address is set as default, update other addresses
        if (newAddress.isDefault) {
          setAddresses([
            ...addresses.map((a) => ({ ...a, isDefault: false })),
            newAddress,
          ]);
        } else {
          setAddresses([...addresses, newAddress]);
        }

        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to save address:", error);
      // You might want to show a toast notification here
      throw error;
    }
  };

  const handleDeleteAddress = async () => {
    if (addressToDelete) {
      try {
        await addressService.deleteAddress(addressToDelete.id);
        fetchAddresses();
        setDeleteModalOpen(false);
        setAddressToDelete(null);
      } catch (error) {
        console.error("Failed to delete address:", error);
        // You might want to show a toast notification here
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await addressService.setDefaultAddress(addressId);
      setAddresses(
        addresses.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }))
      );
      setActiveDropdown(null);
    } catch (error) {
      console.error("Failed to set default address:", error);
      // You might want to show a toast notification here
    }
  };

  const openDeleteModal = (address: Address) => {
    setAddressToDelete(address);
    setDeleteModalOpen(true); // FIXED: Changed from false to true
    setActiveDropdown(null);
  };

  const handleEdit = (addressId: string) => {
    setEditingAddressId(addressId);
    setActiveDropdown(null);
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setShowAddForm(false);
  };

  // Click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-6">Manage Addresses</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">Manage Addresses</h1>

        {/* Add New Address Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 py-4 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center space-x-2 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium uppercase">Add a New Address</span>
          </button>
        )}

        {/* Address Form for new address */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
            <AddressForm
              initialData={null}
              onSubmit={handleSaveAddress}
              onCancel={handleCancelEdit}
              showTitle={true}
              submitButtonText="SAVE ADDRESS"
              cancelButtonText="CANCEL"
            />
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id}>
              {editingAddressId === address.id ? (
                // Show form in place of the address card when editing
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <AddressForm
                    initialData={address}
                    onSubmit={handleSaveAddress}
                    onCancel={handleCancelEdit}
                    showTitle={true}
                    submitButtonText="UPDATE ADDRESS"
                    cancelButtonText="CANCEL"
                  />
                </div>
              ) : (
                // Show address card when not editing
                <div className="bg-white rounded-lg shadow-sm p-6 relative">
                  {/* Address Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 uppercase">
                      {address.label || "Other"}
                    </span>

                    {/* Three Dots Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(
                            activeDropdown === address.id ? null : address.id
                          );
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>

                      {activeDropdown === address.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => handleEdit(address.id)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address.id)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 border-t"
                            >
                              <MapPin className="h-4 w-4" />
                              <span>Set as Default</span>
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(address)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-red-600 border-t"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold text-gray-900">
                        {address.fullName}
                      </p>
                      <p className="text-gray-600">{address.phone}</p>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {address.line1}
                      {address.line2 && `, ${address.line2}`}
                      {`, ${address.city}, ${address.state} - `}
                      <span className="font-medium">{address.zipCode}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {addresses.length === 0 && !showAddForm && (
            <div className="text-center py-12 bg-white rounded-lg">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No addresses saved yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first address
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Address"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure you want to delete this address?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAddress}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </WarningModal>
    </div>
  );
};

export default Addresses;