import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, MapPin, CheckCircle, XCircle } from 'lucide-react';

// Types
interface Settings {
  takeDeliveryFee: boolean;
  checkThreshold: boolean;
  deliveryFee: number; 
  freeDeliveryThreshold: number;
  allowedZipCodes: string[];
}

interface DeliveryCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeliveryConfirmed?: (pincode: string, deliveryFee: number) => void;
}

// Utility function to validate Indian pin code
const validateIndianPincode = (pincode: string): boolean => {
  // Indian pin codes are 6 digits
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

const DeliveryCheckModal: React.FC<DeliveryCheckModalProps> = ({
  isOpen,
  onClose,
  onDeliveryConfirmed
}) => {
  const [pincode, setPincode] = useState('');
  const [checkResult, setCheckResult] = useState<{
    isDeliverable: boolean;
    message: string;
    deliveryFee?: number;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get delivery settings from Redux store
  const deliverySetting = useSelector((state: any) => state.delivery?.deliverySetting as Settings | null);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    setPincode(value);
    setCheckResult(null); // Clear previous result when typing
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pincode.length === 6 && !isChecking) {
      checkDelivery();
    }
  };

  const checkDelivery = async () => {
    if (!deliverySetting) {
      setCheckResult({
        isDeliverable: false,
        message: "Delivery settings not loaded. Please try again."
      });
      return;
    }

    // Validate pin code format
    if (!validateIndianPincode(pincode)) {
      setCheckResult({
        isDeliverable: false,
        message: "Please enter a valid 6-digit Indian pin code"
      });
      return;
    }

    setIsChecking(true);

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const { allowedZipCodes, deliveryFee, takeDeliveryFee } = deliverySetting;

    // Check if delivery is allowed
    // If allowedZipCodes array is empty (length 0), deliver to all Indian pin codes
    const isDeliverable = allowedZipCodes.length === 0 || allowedZipCodes.includes(pincode);

    if (isDeliverable) {
      const fee = takeDeliveryFee ? deliveryFee : 0;
      setCheckResult({
        isDeliverable: true,
        message: `Great! We deliver to ${pincode}`,
        deliveryFee: fee
      });
    } else {
      setCheckResult({
        isDeliverable: false,
        message: "Sorry, we do not deliver to this location"
      });
    }

    setIsChecking(false);
  };

  const handleConfirmDelivery = () => {
    if (checkResult?.isDeliverable && onDeliveryConfirmed) {
      onDeliveryConfirmed(pincode, checkResult.deliveryFee || 0);
    }
    handleClose();
  };

  const handleClose = () => {
    setPincode('');
    setCheckResult(null);
    setIsChecking(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Check Delivery
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your pin code
              </label>
              <input
                type="text"
                id="pincode"
                value={pincode}
                onChange={handlePincodeChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 110001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a valid 6-digit Indian pin code
              </p>
            </div>

            {/* Check Result */}
            {checkResult && (
              <div className={`p-3 rounded-md flex items-start space-x-2 ${
                checkResult.isDeliverable 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {checkResult.isDeliverable ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    checkResult.isDeliverable ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {checkResult.message}
                  </p>
                  {checkResult.isDeliverable && (
                    <div className="mt-2 space-y-1">
                      {checkResult.deliveryFee !== undefined && (
                        <p className="text-xs text-green-700">
                          {checkResult.deliveryFee > 0 
                            ? `Delivery fee: ₹${checkResult.deliveryFee}` 
                            : 'Free delivery'}
                        </p>
                      )}
                      {deliverySetting?.checkThreshold && 
                       deliverySetting?.freeDeliveryThreshold && 
                       checkResult.deliveryFee && 
                       checkResult.deliveryFee > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-2">
                          <p className="text-xs text-blue-800 font-medium">
                            💡 Get FREE delivery on orders above ₹{deliverySetting.freeDeliveryThreshold}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              {!checkResult && (
                <button
                  type="button"
                  onClick={checkDelivery}
                  disabled={pincode.length !== 6 || isChecking}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isChecking ? 'Checking...' : 'Check Delivery'}
                </button>
              )}
              
              {checkResult && checkResult.isDeliverable && (
                <button
                  type="button"
                  onClick={handleConfirmDelivery}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Proceed
                </button>
              )}
              
              {checkResult && (
                <button
                  type="button"
                  onClick={() => {
                    setPincode('');
                    setCheckResult(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Check Another
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCheckModal;