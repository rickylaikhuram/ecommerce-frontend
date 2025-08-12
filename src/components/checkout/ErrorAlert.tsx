// components/checkout/ErrorAlert.tsx
import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  variant?: "error" | "warning" | "info";
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message, 
  onDismiss,
  variant = "error"
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return {
          container: "bg-yellow-50 border-l-4 border-yellow-400",
          icon: "text-yellow-400",
          text: "text-yellow-800"
        };
      case "info":
        return {
          container: "bg-blue-50 border-l-4 border-blue-400",
          icon: "text-blue-400",
          text: "text-blue-800"
        };
      default:
        return {
          container: "bg-red-50 border-l-4 border-red-400",
          icon: "text-red-400",
          text: "text-red-800"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`mb-6 p-4 ${styles.container} rounded-r-lg shadow-sm`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${styles.icon} hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;