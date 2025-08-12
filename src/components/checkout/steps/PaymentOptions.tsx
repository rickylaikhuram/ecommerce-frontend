// components/checkout/PaymentOptions.tsx
import React, { useState } from "react";
import {
  CreditCard,
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
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Rupay accepted",
      popular: true,
      secure: true,
      buttonText: "Pay Now",
      buttonIcon: CreditCard,
      loadingText: "Processing Payment...",
    },
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
      fee: "₹40",
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
    <div className="bg-white rounded-xl shadow-lg border border-blue-100">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-sm text-blue-600 font-bold">4</span>
          </div>
          <h2 className="text-xl font-semibold">Payment Method</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
          <Lock className="h-4 w-4 text-green-600" />
          <span>All payments are secured with 256-bit SSL encryption</span>
        </div>

        <div className="space-y-4">
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
                className={`relative block p-5 border-2 rounded-xl transition-all duration-200 ${
                  isDisabled
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : isSelected
                    ? "border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md"
                    : "border-gray-200 hover:border-blue-200 bg-white hover:bg-blue-50 hover:shadow-sm cursor-pointer"
                } ${isProcessing && !isSelected ? "pointer-events-none" : ""}`}
              >
                {method.popular && !isDisabled && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => handleSelectMethod(method.id)}
                    disabled={isProcessing}
                    className={`scale-125 ${
                      isDisabled ? "text-gray-400" : "text-blue-600"
                    }`}
                    style={{ pointerEvents: "none" }}
                  />

                  <div
                    className={`p-3 rounded-lg ${
                      isDisabled
                        ? "bg-gray-200"
                        : isSelected
                        ? "bg-blue-200"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isDisabled
                          ? "text-gray-400"
                          : isSelected
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className={`font-semibold ${
                          isDisabled
                            ? "text-gray-400"
                            : isSelected
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {method.name}
                      </h3>
                      {method.secure && (
                        <Shield
                          className={`h-4 w-4 ${
                            isDisabled ? "text-gray-400" : "text-green-600"
                          }`}
                        />
                      )}
                      {method.fee && (
                        <span
                          className={`text-sm font-medium ${
                            isDisabled ? "text-gray-400" : "text-orange-600"
                          }`}
                        >
                          + {method.fee}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isDisabled
                          ? "text-gray-400"
                          : isSelected
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      {method.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isSelected && !isDisabled && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}

                    {isSelected && (
                      <button
                        onClick={(e) => handleActionClick(method.id, e)}
                        disabled={isProcessing}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors min-w-[140px] justify-center ${
                          isCurrentlyProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : isProcessing
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : method.id === "card"
                            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
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
                    )}
                  </div>
                </div>

                {/* Additional info for selected method */}
                {isSelected && !isDisabled && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    {method.id === "card" && (
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Accepted Cards:</strong>
                        </p>
                        <div className="flex space-x-2">
                          <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                            VISA
                          </div>
                          <div className="w-8 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            MC
                          </div>
                          <div className="w-8 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            RU
                          </div>
                        </div>
                      </div>
                    )}

                    {method.id === "upi" && (
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Popular UPI Apps:</strong>
                        </p>
                        <div className="flex space-x-3">
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            PhonePe
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Google Pay
                          </div>
                          <div className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                            Paytm
                          </div>
                        </div>
                      </div>
                    )}

                    {method.id === "cod" && (
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-start space-x-2">
                          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-white text-xs font-bold">
                              !
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-orange-800 font-medium">
                              Additional ₹40 fee applies
                            </p>
                            <p className="text-xs text-orange-700 mt-1">
                              Please have exact change ready for the delivery
                              person
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security notice */}
        <div
          className={`mt-6 p-4 rounded-lg border transition-all duration-200 ${
            isProcessing
              ? "bg-gray-50 border-gray-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex items-start space-x-3">
            <Shield
              className={`h-5 w-5 mt-0.5 ${
                isProcessing ? "text-gray-400" : "text-green-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium ${
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
