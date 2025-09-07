// pages/Addresses.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, MoreVertical, Edit2, Trash2, MapPin } from "lucide-react";
import AddressForm from "../../components/common/AddressForm";
import WarningModal from "../../components/common/WarningModal";
import type { CreateAddressPayload } from "../../services/address.services";
import type { Address } from "../../types/user.types";
import type { RootState, AppDispatch } from "../../redux/store"; 
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../redux/slice/address";

const Addresses: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, status, error } = useSelector(
    (state: RootState) => state.address
  );

  // Local UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const loading = status === "loading";

  // Fetch addresses on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAddresses());
    }
  }, [dispatch, status]);

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

        await dispatch(
          updateAddress({
            addressId: editingAddress.id,
            data: payload,
          })
        ).unwrap();

        setEditingAddressId(null);
      } else {
        // Create new address
        const payload: CreateAddressPayload = {
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

        await dispatch(createAddress(payload)).unwrap();
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
        await dispatch(deleteAddress(addressToDelete.id)).unwrap();
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
      await dispatch(setDefaultAddress(addressId)).unwrap();
      setActiveDropdown(null);
    } catch (error) {
      console.error("Failed to set default address:", error);
      // You might want to show a toast notification here
    }
  };

  const openDeleteModal = (address: Address) => {
    setAddressToDelete(address);
    setDeleteModalOpen(true);
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

  // Show error state
  if (status === "failed" && error) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-6">Manage Addresses</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading addresses
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => dispatch(fetchAddresses())}
                  className="mt-2 text-sm text-red-800 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-6">Manage Addresses</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
            disabled={loading}
            className="w-full mb-6 py-4 border-2 border-dashed border-emerald-500 rounded-lg flex items-center justify-center space-x-2 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Loading indicator for operations */}
        {loading && addresses.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800 text-sm">Processing...</span>
            </div>
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
                        disabled={loading}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>

                      {activeDropdown === address.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => handleEdit(address.id)}
                            disabled={loading}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 disabled:opacity-50"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address.id)}
                              disabled={loading}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 border-t disabled:opacity-50"
                            >
                              <MapPin className="h-4 w-4" />
                              <span>Set as Default</span>
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(address)}
                            disabled={loading}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-red-600 border-t disabled:opacity-50"
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

          {addresses.length === 0 && !showAddForm && !loading && (
            <div className="text-center py-12 bg-white rounded-lg">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No addresses saved yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
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
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAddress}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </WarningModal>
    </div>
  );
};

export default Addresses;
