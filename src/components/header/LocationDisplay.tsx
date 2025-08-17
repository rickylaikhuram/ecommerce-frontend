// components/Header/LocationDisplay.tsx
import React from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

interface LocationInfo {
  text: string;
  isDefault: boolean;
  address?: any;
}

interface LocationDisplayProps {
  locationInfo: LocationInfo;
  addressLoading: boolean;
  className?: string;
  size?: number;
  isCompact?: boolean;
  isMobile?: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  locationInfo,
  addressLoading,
  className = "",
  size = 20,
  isCompact = false,
  isMobile = false,
}) => {
  const location = useLocation();
  const isActive = location.pathname === "/location";

  if (isMobile) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <div className="relative">
          <MapPin
            size={14}
            fill={isActive ? "currentColor" : "none"}
          />
          {addressLoading && (
            <Loader2 className="absolute -top-1 -right-1 w-2.5 h-2.5 animate-spin text-blue-600" />
          )}
        </div>
        <span className="text-xs text-gray-600">
          Delivery to{" "}
          <span className="font-medium text-gray-800">{locationInfo.text}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <MapPin
          size={size}
          fill={isActive ? "currentColor" : "none"}
        />
        {addressLoading && (
          <Loader2 className="absolute -top-1 -right-1 w-3 h-3 animate-spin text-blue-600" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Delivery to</span>
        <span
          className={`text-sm font-medium text-gray-800 truncate ${
            isCompact ? "max-w-[120px]" : "max-w-[200px]"
          }`}
        >
          {locationInfo.text}
        </span>
      </div>
    </div>
  );
};