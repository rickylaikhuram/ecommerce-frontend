// components/Header/MobileHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { SearchAutoComplete } from "./SearchAutoComplete";
import { LocationDisplay } from "./LocationDisplay";
import type { AutocompleteResult } from "../../types/search.types";

interface MobileHeaderProps {
  showHeader: boolean;
  isAuthPage: boolean;
  onMenuToggle: () => void;
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: AutocompleteResult) => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  locationInfo: any;
  onLocationClick?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  showHeader,
  isAuthPage,
  onMenuToggle,
  onSearch,
  onSuggestionClick,
  onNavClick,
  locationInfo,
  onLocationClick,
}) => {
  const getHeaderClasses = () => {
    if (isAuthPage) {
      return "sm:hidden w-full bg-emerald-900 z-50 relative";
    }

    return `sm:hidden w-full bg-emerald-900 z-50 fixed top-0 left-0 right-0 transition-transform duration-300 ease-out ${
      showHeader ? "translate-y-0" : "-translate-y-full"
    }`;
  };

  return (
    <>
      {/* Spacer for fixed header - only on non-auth pages */}
      {!isAuthPage && <div className="sm:hidden h-[120px]" />}

      <header className={getHeaderClasses()}>
        <div className="border-b border-emerald-400/30">
          {/* Top row - Menu, Logo, and Location */}
          <div className="flex items-center justify-between py-0 px-[14px]">
            {/* Left side - Menu and Logo */}
            <div className="flex items-center">
              <button
                onClick={onMenuToggle}
                className="p-2 -ml-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                <Menu size={22} className="text-white" />
              </button>

              <Link
                key={"home"}
                to={"/"}
                onClick={(e) => onNavClick(e, "/")}
                className="hover:bg-white/10 transition-colors rounded-lg"
              >
                <img
                  src="/logo_white_details.jpeg"
                  alt="Home"
                  className="h-[70px]"
                />
              </Link>
            </div>

            {/* Right side - Location Display */}
            <div className="flex-shrink-0">
              {onLocationClick ? (
                <button
                  onClick={onLocationClick}
                  className="flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  aria-label="Change location"
                >
                  <LocationDisplay
                    locationInfo={locationInfo}
                    isMobile={true}
                  />
                </button>
              ) : (
                <Link
                  to="/location"
                  className="flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  onClick={(e) => onNavClick(e, "/location")}
                >
                  <LocationDisplay
                    locationInfo={locationInfo}
                    isMobile={true}
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Bottom row - Search Bar */}
          <div className="px-4 pb-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm">
              <SearchAutoComplete
                placeholder="Search for products..."
                onSearch={onSearch}
                onSuggestionClick={onSuggestionClick}
                className="w-full"
                isMobile={true}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
