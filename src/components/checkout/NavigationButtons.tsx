// components/checkout/NavigationButtons.tsx
import React from "react";

interface NavigationButtonsProps {
  currentStep: number;
  maxStep: number;
  isAuthenticated: boolean;
  canProceedToPayment: boolean;
  isProcessing: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
  showContinueButton?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  maxStep,
  isAuthenticated,
  canProceedToPayment,
  isProcessing,
  onPreviousStep,
  onNextStep,
  showContinueButton = true,
}) => {
  // Don't show navigation if not authenticated and on step 1
  if (currentStep === 1 && !isAuthenticated) {
    return null;
  }

  const getNextButtonText = () => {
    if (isProcessing) return "Processing...";
    if (currentStep === 3 && !canProceedToPayment) return "Resolve Cart Issues";
    return "Continue";
  };

  const isNextButtonDisabled = () => {
    return isProcessing || (currentStep === 3 && !canProceedToPayment);
  };

  return (
    <div className="flex justify-between mt-8 space-x-4">
      <button
        onClick={onPreviousStep}
        disabled={currentStep === 1 || isProcessing}
        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
          currentStep === 1 || isProcessing
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md hover:shadow-lg"
        }`}
      >
        Previous
      </button>

      {/* Only show Continue button for steps 1-3, step 4 uses individual payment buttons */}
      {showContinueButton && currentStep < maxStep && (
        <button
          onClick={onNextStep}
          disabled={isNextButtonDisabled()}
          className={`flex-1 max-w-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
            isNextButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            getNextButtonText()
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;