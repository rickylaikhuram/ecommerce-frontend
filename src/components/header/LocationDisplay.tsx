// components/Header/LocationDisplay.tsx - Enhanced version
import React from "react";
import { MapPin, ChevronDown, AlertTriangle } from "lucide-react";

interface LocationDisplayProps {
  locationInfo: {
    text: string;
    isDefault: boolean;
    showDeliveryCheck?: boolean;
    hasUndeliverableAddresses?: boolean;
    deliverableAddressesCount?: number;
  };
  addressLoading: boolean;
  isMobile?: boolean;
  isCompact?: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  locationInfo,
  addressLoading,
  isMobile = false,
  isCompact = false,
}) => {
  // Size configurations based on device type
  const iconSize = isMobile ? 14 : isCompact ? 16 : 18;
  const chevronSize = isMobile ? 12 : 14;
  const textSize = isMobile ? "text-xs" : isCompact ? "text-sm" : "text-sm";
  const maxWidth = isMobile ? "max-w-24" : isCompact ? "max-w-28" : "max-w-32";

  if (addressLoading) {
    return (
      <div className="flex items-center space-x-1 text-gray-500">
        <MapPin size={iconSize} />
        <span className={`${textSize} ${maxWidth} truncate`}>Loading...</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      title={
        locationInfo.hasUndeliverableAddresses
          ? "Some addresses may not be deliverable. Click to check delivery."
          : "Click to check delivery availability"
      }
    >
      <MapPin size={iconSize} />
      <span className={`${textSize} ${maxWidth} truncate font-medium`}>
        {locationInfo.text}
      </span>

      {/* Show chevron if delivery check is available */}
      {locationInfo.showDeliveryCheck && (
        <ChevronDown size={chevronSize} className="text-gray-400" />
      )}

      {/* Show warning icon if user has addresses that can't be delivered to */}
      {locationInfo.hasUndeliverableAddresses && (
        <span title="Some of your addresses may not be deliverable">
          <AlertTriangle size={chevronSize} className="text-orange-500" />
        </span>
      )}

      {/* Show count for deliverable addresses in compact mode */}
      {isCompact &&
        locationInfo.deliverableAddressesCount &&
        locationInfo.deliverableAddressesCount > 1 && (
          <span className="text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
            {locationInfo.deliverableAddressesCount}
          </span>
        )}
    </div>
  );
};
