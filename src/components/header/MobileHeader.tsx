// components/Header/MobileHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { SearchAutocomplete } from "./SearchAutoComplete";
import { CartIcon } from "./CartIcon";
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
}) => {
  return (
    <header
      className={`sm:hidden w-full bg-white transition-transform duration-300 ${
        isScrolled ? "fixed top-0 left-0 z-40 shadow-md" : "relative"
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

          <SearchAutocomplete
            placeholder="Search..."
            onSearch={onSearch}
            onSuggestionClick={onSuggestionClick}
            className="flex-1"
            isMobile={true}
          />

          <Link
            to="/cart"
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <CartIcon size={20} />
          </Link>
        </div>

        <div className="px-3 pb-2">
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
        </div>
      </div>
    </header>
  );
};