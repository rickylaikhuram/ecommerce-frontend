// components/checkout/CheckoutHeader.tsx
import React from "react";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

interface CheckoutHeaderProps {
  onBackClick: () => void;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ onBackClick }) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-blue-50 rounded-full transition-all duration-200 group"
            >
              <ArrowLeft className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
            </button>
            <h1 className="ml-4 text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                SSL Secured
              </span>
            </div>
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;