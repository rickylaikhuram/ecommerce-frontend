// components/Header/DesktopHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import { User, Heart } from "lucide-react";
import { SearchAutoComplete } from "./SearchAutoComplete";
import { CartIcon } from "./CartIcon";
import { LocationDisplay } from "./LocationDisplay";
import { Navigation, type NavItem } from "./Navigation";
import type { AutocompleteResult } from "../../types/search.types";

interface DesktopHeaderProps {
  shouldFixHeader: boolean;
  isScrolled: boolean;
  navItems: NavItem[];
  profileHref: string;
  profileLabel: string;
  locationInfo: any;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: AutocompleteResult) => void;
  onLocationClick?: () => void; // Add this prop for delivery check
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  shouldFixHeader,
  isScrolled,
  navItems,
  profileHref,
  locationInfo,
  onNavClick,
  onSearch,
  onSuggestionClick,
  onLocationClick, // Add this prop
}) => {
  const isActive = (path: string) => window.location.pathname === path;

  return (
    <>
      {shouldFixHeader && <div className="hidden sm:block h-[73px]" />}

      <header
        className={`hidden sm:block w-full bg-emerald-800 transition-all duration-300 px-2 ${
          shouldFixHeader
            ? "fixed top-0 left-0 z-50 animate-slideDown"
            : "relative"
        } ${isScrolled ? "shadow-lg" : ""}`}
      >
        <div className="border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <Navigation
                items={navItems}
                onNavClick={onNavClick}
                className="hidden lg:flex"
              />

              {/* Location Display - Desktop (lg and above) */}
              <button
                onClick={onLocationClick}
                className="hidden lg:flex hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <LocationDisplay locationInfo={locationInfo} />
              </button>
            </div>

            {/* Middle Section - Location for md screens */}
            <div className="hidden md:flex lg:hidden">
              <button
                onClick={onLocationClick}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <LocationDisplay locationInfo={locationInfo} isCompact />
              </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <SearchAutoComplete
                placeholder="Search products..."
                onSearch={onSearch}
                onSuggestionClick={onSuggestionClick}
                className="w-70 xl:w-99"
              />

              {/* Icons */}
              <div className="flex items-center gap-2">
                <Link
                  to={profileHref}
                  className={`p-2.5 rounded-lg transition-colors ${
                    isActive(profileHref)
                      ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={(e) => onNavClick(e, profileHref)}
                >
                  <User
                    size={20}
                    fill={isActive(profileHref) ? "currentColor" : "none"}
                  />
                </Link>

                <Link
                  to="/wishlist"
                  className={`p-2.5 rounded-lg transition-colors relative ${
                    isActive("/wishlist")
                      ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={(e) => onNavClick(e, "/wishlist")}
                >
                  <Heart
                    size={20}
                    fill={isActive("/wishlist") ? "currentColor" : "none"}
                  />
                </Link>

                <Link
                  to="/cart"
                  className={`p-2.5 rounded-lg transition-colors relative ${
                    isActive("/cart")
                      ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={(e) => onNavClick(e, "/cart")}
                >
                  <CartIcon size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
