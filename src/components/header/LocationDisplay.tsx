// components/Header/LocationDisplay.tsx - Enhanced version
import React from "react";
import { MapPin, ChevronDown, AlertTriangle } from "lucide-react";
import { useAppSelector } from "../../redux/hook";

interface LocationDisplayProps {
  locationInfo: {
    text: string;
    isDefault: boolean;
    showDeliveryCheck?: boolean;
    hasUndeliverableAddresses?: boolean;
    deliverableAddressesCount?: number;
  };
  isMobile?: boolean;
  isCompact?: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  locationInfo,
  isMobile = false,
  isCompact = false,
}) => {
  // Size configurations based on device type
  const iconSize = isMobile ? 14 : isCompact ? 16 : 18;
  const chevronSize = isMobile ? 12 : 14;
  const textSize = isMobile ? "text-xs" : isCompact ? "text-sm" : "text-md";
  const maxWidth = isMobile ? "max-w-24" : isCompact ? "max-w-28" : "max-w-32";
  const { status } = useAppSelector((state) => state.address);
  const addressLoading = status === "loading";

  if (addressLoading) {
    return (
      <div className="flex items-center space-x-1 text-white/70">
        <MapPin size={iconSize} />
        <span className={`${textSize} ${maxWidth} truncate`}>Loading...</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors cursor-pointer"
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
        <ChevronDown size={chevronSize} className="text-white/60" />
      )}

      {/* Show warning icon if user has addresses that can't be delivered to */}
      {locationInfo.hasUndeliverableAddresses && (
        <span title="Some of your addresses may not be deliverable">
          <AlertTriangle size={chevronSize} className="text-amber-400" />
        </span>
      )}

      {/* Show count for deliverable addresses in compact mode */}
      {isCompact &&
        locationInfo.deliverableAddressesCount &&
        locationInfo.deliverableAddressesCount > 1 && (
          <span className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm">
            {locationInfo.deliverableAddressesCount}
          </span>
        )}
    </div>
  );
};
