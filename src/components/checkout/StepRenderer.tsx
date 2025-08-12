// components/checkout/StepRenderer.tsx
import React from "react";
import { LogIn, Check, Package } from "lucide-react";
import type { Address } from "../../types/user.types";
import type { User } from "../../types/user.types";
import type { ProductResponse } from "../../types/checkout.types";

// Import your existing step components
import AddressSection from "./steps/AddressSection";
import OrderSummary from "./steps/OrderSummary";
import PaymentOptions from "./steps/PaymentOptions";
import UserInfo from "./steps/UserInfo";

interface StepRendererProps {
  currentStep: number;
  isAuthenticated: boolean;
  userProfile: User | null;
  
  // Address related props
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddAddress: () => void;
  onEditAddress: (address: Address) => void;
  onAddressUpdated: (savedAddress?: Address) => void;
  isAddressLoading: boolean;
  
  // Cart/Order related props
  cartItems: ProductResponse[];
  onViewDetails: () => void;
  onRemoveInvalidItem: (cartItemId: string) => void;
  
  // Payment related props
  onSelectPayment: (method: string) => void;
  onPayNow: (method: string) => void;
  onGenerateQR: () => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  selectedPayment: string;
  
  // Navigation props
  onNavigateToSignIn: () => void;
  onNavigateToSignUp: () => void;
  onLogout: () => void;
  onContinueToAddress: () => void;
}

const StepRenderer: React.FC<StepRendererProps> = ({
  currentStep,
  isAuthenticated,
  userProfile,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onAddressUpdated,
  isAddressLoading,
  cartItems,
  onViewDetails,
  onRemoveInvalidItem,
  onSelectPayment,
  onPayNow,
  onGenerateQR,
  onPlaceOrder,
  isProcessing,
  selectedPayment,
  onNavigateToSignIn,
  onNavigateToSignUp,
  onLogout,
  onContinueToAddress,
}) => {
  switch (currentStep) {
    case 1:
      if (!isAuthenticated) {
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-blue-100">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Sign in to your account to continue with your secure checkout
            </p>
            <div className="space-y-4">
              <button
                onClick={onNavigateToSignIn}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In to Continue
              </button>
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={onNavigateToSignUp}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100 space-y-4">
            <div className="flex items-center mb-6 pl-7">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  You're all set!
                </h2>
                <p className="text-gray-600">
                  Ready to proceed with your order
                </p>
              </div>
            </div>
            <UserInfo user={userProfile} onChangeClick={onLogout} />
            <button
              onClick={onContinueToAddress}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue to Address Selection
            </button>
          </div>
        );
      }

    case 2:
      return (
        <AddressSection
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={onSelectAddress}
          onAddAddress={onAddAddress}
          onEditAddress={onEditAddress}
          onAddressUpdated={onAddressUpdated}
          isLoading={isAddressLoading}
        />
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Blue Header */}
            <div className="bg-blue-600 text-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-7 h-7 bg-white text-blue-600 rounded-full text-sm font-bold">
                    2
                  </span>
                  <h3 className="text-sm font-medium uppercase tracking-wide">
                    DELIVERY ADDRESS
                  </h3>
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => onContinueToAddress()}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-blue-600 font-medium text-sm px-3 py-1.5 rounded-md border border-white border-opacity-30 hover:border-opacity-50 transition-all duration-200 hover:shadow-sm"
                >
                  CHANGE
                </button>
              </div>
            </div>

            {/* Content */}
            {selectedAddress && (
              <div className="p-4">
                <p className="text-gray-900 text-sm leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    {selectedAddress.fullName} {" - "} {selectedAddress.phone}
                  </span>
                  <br />
                  <span className="text-gray-700">
                    {selectedAddress.line1}
                    {selectedAddress.line2 && `, ${selectedAddress.line2}`}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state} -{" "}
                    {selectedAddress.zipCode}
                  </span>
                </p>
              </div>
            )}
          </div>

          <OrderSummary
            items={cartItems}
            onViewDetails={onViewDetails}
            onRemoveItem={onRemoveInvalidItem}
          />
        </div>
      );

    case 4:
      return (
        <PaymentOptions
          onSelectPayment={onSelectPayment}
          onPayNow={onPayNow}
          onGenerateQR={onGenerateQR}
          onPlaceOrder={onPlaceOrder}
          isProcessing={isProcessing}
          processingMethod={selectedPayment}
        />
      );

    default:
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Invalid Step
          </h2>
          <p className="text-gray-600">
            Something went wrong. Please refresh the page.
          </p>
        </div>
      );
  }
};

export default StepRenderer;