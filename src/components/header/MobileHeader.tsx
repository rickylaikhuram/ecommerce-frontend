// components/Header/MobileHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { SearchAutoComplete } from "./SearchAutoComplete";
import { LocationDisplay } from "./LocationDisplay";
import type { AutocompleteResult } from "../../types/search.types";

interface MobileHeaderProps {
  isScrolled: boolean;
  showHeader: boolean;
  onMenuToggle: () => void;
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: AutocompleteResult) => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  locationInfo: any;
  addressLoading: boolean;
  onLocationClick?: () => void; // Add this prop for delivery check
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  isScrolled,
  showHeader,
  onMenuToggle,
  onSearch,
  onSuggestionClick,
  onNavClick,
  locationInfo,
  addressLoading,
  onLocationClick, // Add this prop
}) => {
  return (
    <header
      className={`sm:hidden w-full bg-white transition-transform duration-300 ${
        isScrolled ? "fixed top-0 left-0 z-[60] shadow-md" : "relative z-[60]"
      } ${!showHeader && isScrolled ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="border-b border-gray-100">
        <div className="flex items-center gap-2 p-3">
          <button
            onClick={onMenuToggle}
            className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          <SearchAutoComplete
            placeholder="Search..."
            onSearch={onSearch}
            onSuggestionClick={onSuggestionClick}
            className="flex-1"
            isMobile={true}
          />

          <Link
            key={"home"}
            to={"/"}
            onClick={(e) => onNavClick(e, "/")}
          >
            <img
              src="/logo.jpeg"
              alt="Home"
              className={`h-9 w-9 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-50 `}
            />
          </Link>
        </div>

        <div className="px-3 pb-2">
          {onLocationClick ? (
            <button
              onClick={onLocationClick}
              className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
            >
              <LocationDisplay
                locationInfo={locationInfo}
                addressLoading={addressLoading}
                isMobile={true}
              />
            </button>
          ) : (
            <Link
              to="/location"
              className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={(e) => onNavClick(e, "/location")}
            >
              <LocationDisplay
                locationInfo={locationInfo}
                addressLoading={addressLoading}
                isMobile={true}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};