// components/checkout/PaymentOptions.tsx
import React, { useState } from "react";
import {
  // CreditCard,
  Smartphone,
  Package,
  Shield,
  Lock,
  CheckCircle,
  QrCode,
  ShoppingBag,
  Loader2,
} from "lucide-react";

interface PaymentOptionsProps {
  onSelectPayment: (method: string) => void;
  onPayNow?: (method: string) => void;
  onGenerateQR?: () => void;
  onPlaceOrder?: () => void;
  isProcessing?: boolean;
  processingMethod?: string;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  onSelectPayment,
  onPayNow,
  onGenerateQR,
  onPlaceOrder,
  isProcessing = false,
  processingMethod = "",
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const paymentMethods = [
    // {
    //   id: "card",
    //   name: "Credit/Debit Card",
    //   icon: CreditCard,
    //   description: "Visa, Mastercard, Rupay accepted",
    //   popular: true,
    //   secure: true,
    //   buttonText: "Pay Now",
    //   buttonIcon: CreditCard,
    //   loadingText: "Processing Payment...",
    // },
    {
      id: "upi",
      name: "UPI Payment",
      icon: Smartphone,
      description: "PhonePe, Google Pay, Paytm",
      popular: true,
      secure: true,
      buttonText: "Generate QR Code",
      buttonIcon: QrCode,
      loadingText: "Generating QR...",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: Package,
      description: "Pay when you receive",
      popular: false,
      secure: false,
      // fee: "₹40",
      buttonText: "Place Order",
      buttonIcon: ShoppingBag,
      loadingText: "Placing Order...",
    },
  ];

  const handleSelectMethod = (methodId: string) => {
    if (isProcessing) return; // Prevent selection during processing
    setSelectedMethod(methodId);
    onSelectPayment(methodId);
  };

  const handleActionClick = (methodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return; // Prevent multiple clicks

    switch (methodId) {
      case "card":
        onPayNow?.(methodId);
        break;
      case "upi":
        onGenerateQR?.();
        break;
      case "cod":
        onPlaceOrder?.();
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-emerald-100">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 sm:p-4 rounded-t-xl">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xs sm:text-sm text-emerald-600 font-bold">
              4
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">Payment Method</h2>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="mb-3 sm:mb-4 flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          <span>All payments are secured with 256-bit SSL encryption</span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const ButtonIcon = method.buttonIcon;
            const isSelected = selectedMethod === method.id;
            const isCurrentlyProcessing =
              isProcessing && processingMethod === method.id;
            const isDisabled = isProcessing && processingMethod !== method.id;

            return (
              <div
                key={method.id}
                onClick={
                  !isSelected && !isProcessing
                    ? () => handleSelectMethod(method.id)
                    : undefined
                }
                className={`relative block p-3 sm:p-5 border-2 rounded-xl transition-all duration-200 ${
                  isDisabled
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : isSelected
                    ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-emerald-100 shadow-md"
                    : "border-gray-200 hover:border-emerald-200 bg-white hover:bg-emerald-50 hover:shadow-sm cursor-pointer"
                } ${isProcessing && !isSelected ? "pointer-events-none" : ""}`}
              >
                {method.popular && !isDisabled && (
                  <div className="absolute -top-2 left-2 sm:left-4">
                    <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => handleSelectMethod(method.id)}
                    disabled={isProcessing}
                    className={`scale-110 sm:scale-125 mt-1 sm:mt-0 ${
                      isDisabled ? "text-gray-400" : "text-emerald-600"
                    }`}
                    style={{ pointerEvents: "none" }}
                  />

                  <div
                    className={`p-2 sm:p-3 rounded-lg ${
                      isDisabled
                        ? "bg-gray-200"
                        : isSelected
                        ? "bg-emerald-200"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        isDisabled
                          ? "text-gray-400"
                          : isSelected
                          ? "text-emerald-700"
                          : "text-gray-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <h3
                        className={`font-semibold text-sm sm:text-base ${
                          isDisabled
                            ? "text-gray-400"
                            : isSelected
                            ? "text-emerald-900"
                            : "text-gray-900"
                        }`}
                      >
                        {method.name}
                      </h3>
                      {method.secure && (
                        <Shield
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            isDisabled ? "text-gray-400" : "text-green-600"
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-xs sm:text-sm ${
                        isDisabled
                          ? "text-gray-400"
                          : isSelected
                          ? "text-emerald-700"
                          : "text-gray-600"
                      }`}
                    >
                      {method.description}
                    </p>
                  </div>

                  {/* Desktop button and check icon */}
                  <div className="hidden sm:flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {isSelected && !isDisabled && (
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    )}

                    {isSelected && (
                      <button
                        onClick={(e) => handleActionClick(method.id, e)}
                        disabled={isProcessing}
                        className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors min-w-[100px] sm:min-w-[140px] justify-center ${
                          isCurrentlyProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : isProcessing
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : method.id === "card"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            : method.id === "upi"
                            ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                            : "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                        }`}
                      >
                        {isCurrentlyProcessing ? (
                          <>
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                            <span className="hidden sm:inline">
                              Processing...
                            </span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <ButtonIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              {method.buttonText}
                            </span>
                            <span className="sm:hidden">
                              {method.id === "upi"
                                ? "QR"
                                : method.id === "cod"
                                ? "Order"
                                : "Pay"}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Mobile check icon only */}
                  <div className="sm:hidden">
                    {isSelected && !isDisabled && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Additional info for selected method */}
                {isSelected && !isDisabled && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-emerald-200">
                    {/* Mobile: Compact details */}
                    <div className="sm:hidden">
                      {method.id === "card" && (
                        <div className="bg-white rounded-lg p-2 border border-emerald-200 mb-3">
                          <p className="text-xs text-gray-700 mb-1">
                            <strong>Accepted Cards:</strong>
                          </p>
                          <div className="flex space-x-1">
                            <div className="w-5 h-3 bg-emerald-600 rounded text-white text-[10px] flex items-center justify-center font-bold">
                              VISA
                            </div>
                            <div className="w-5 h-3 bg-red-500 rounded text-white text-[10px] flex items-center justify-center font-bold">
                              MC
                            </div>
                            <div className="w-5 h-3 bg-orange-500 rounded text-white text-[10px] flex items-center justify-center font-bold">
                              RU
                            </div>
                          </div>
                        </div>
                      )}

                      {method.id === "upi" && (
                        <div className="bg-white rounded-lg p-2 border border-emerald-200 mb-3">
                          <p className="text-xs text-gray-700 mb-1">
                            <strong>UPI Apps:</strong>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <div className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                              PhonePe
                            </div>
                            <div className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                              GPay
                            </div>
                            <div className="text-[10px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded">
                              Paytm
                            </div>
                          </div>
                        </div>
                      )}

                      {method.id === "cod" && (
                        <div className="bg-orange-50 rounded-lg p-2 border border-orange-200 mb-3">
                          <div className="flex items-start space-x-1">
                            <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                              <span className="text-white text-[8px] font-bold">
                                !
                              </span>
                            </div>
                            <p className="text-[10px] text-orange-700 mt-0.5">
                              Have exact change ready
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Mobile: Full-width button */}
                      <button
                        onClick={(e) => handleActionClick(method.id, e)}
                        disabled={isProcessing}
                        className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-colors justify-center ${
                          isCurrentlyProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : isProcessing
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : method.id === "card"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            : method.id === "upi"
                            ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                            : "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                        }`}
                      >
                        {isCurrentlyProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <ButtonIcon className="h-4 w-4" />
                            <span>{method.buttonText}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Desktop: Original layout */}
                    <div className="hidden sm:block">
                      {method.id === "card" && (
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-emerald-200">
                          <p className="text-xs sm:text-sm text-gray-700 mb-2">
                            <strong>Accepted Cards:</strong>
                          </p>
                          <div className="flex space-x-2">
                            <div className="w-6 h-4 sm:w-8 sm:h-6 bg-emerald-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              <span className="text-xs sm:text-xs">VISA</span>
                            </div>
                            <div className="w-6 h-4 sm:w-8 sm:h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                              <span className="text-xs sm:text-xs">MC</span>
                            </div>
                            <div className="w-6 h-4 sm:w-8 sm:h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                              <span className="text-xs sm:text-xs">RU</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {method.id === "upi" && (
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-emerald-200">
                          <p className="text-xs sm:text-sm text-gray-700 mb-2">
                            <strong>Popular UPI Apps:</strong>
                          </p>
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              PhonePe
                            </div>
                            <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                              Google Pay
                            </div>
                            <div className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                              Paytm
                            </div>
                          </div>
                        </div>
                      )}

                      {method.id === "cod" && (
                        <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                              <span className="text-white text-xs font-bold">
                                !
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-orange-700 mt-1">
                                Please have exact change ready for the delivery
                                person
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security notice */}
        <div
          className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
            isProcessing
              ? "bg-gray-50 border-gray-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Shield
              className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 ${
                isProcessing ? "text-gray-400" : "text-green-600"
              }`}
            />
            <div>
              <p
                className={`text-xs sm:text-sm font-medium ${
                  isProcessing ? "text-gray-600" : "text-green-800"
                }`}
              >
                Secure Payment Promise
              </p>
              <p
                className={`text-xs mt-1 ${
                  isProcessing ? "text-gray-500" : "text-green-700"
                }`}
              >
                Your payment information is encrypted and secure. We never store
                your card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
