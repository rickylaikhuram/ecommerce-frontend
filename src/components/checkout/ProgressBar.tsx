// components/checkout/ProgressBar.tsx
import React from "react";
import { Check, type LucideIcon } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Progress */}
        <div className="block md:hidden mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-sm text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Desktop Progress */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.id < currentStep
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                        : step.id === currentStep
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p
                      className={`text-base font-semibold transition-colors ${
                        step.id <= currentStep
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-sm transition-colors ${
                        step.id <= currentStep
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 px-6">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        step.id < currentStep
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;