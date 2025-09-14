
// components/Header/MobileHeader.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  onLocationClick?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  isScrolled,
  showHeader,
  onMenuToggle,
  onSearch,
  onSuggestionClick,
  onNavClick,
  locationInfo,
  onLocationClick,
}) => {
  const location = useLocation();
  
  // Check if current page is an auth page
  const authPages = ['/signin', '/signup', '/forgot-password', '/signinwithotp'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <header
      className={`sm:hidden w-full bg-emerald-900 transition-transform duration-300 ${
        isScrolled && !isAuthPage
          ? "fixed top-0 left-0 z-50" // Only fixed when scrolled AND not on auth pages
          : "relative z-50"
      } ${!showHeader && isScrolled && !isAuthPage ? "-translate-y-full" : "translate-y-0"}`}
    >
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
              <img src="/logo_white_details.jpeg" alt="Home" className="h-[70px]" />
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
                <LocationDisplay locationInfo={locationInfo} isMobile={true} />
              </button>
            ) : (
              <Link
                to="/location"
                className="flex items-center p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                onClick={(e) => onNavClick(e, "/location")}
              >
                <LocationDisplay locationInfo={locationInfo} isMobile={true} />
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
  );
};