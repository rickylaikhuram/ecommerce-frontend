// components/Header/TabletHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu, User, Heart } from "lucide-react";
import { SearchAutoComplete } from "./SearchAutoComplete";
import { CartIcon } from "./CartIcon";
import { LocationDisplay } from "./LocationDisplay";
import type { AutocompleteResult } from "../../types/search.types";

interface TabletHeaderProps {
  shouldFixHeader: boolean;
  isScrolled: boolean;
  profileHref: string;
  locationInfo: any;
  onMenuToggle: () => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: AutocompleteResult) => void;
  onLocationClick?: () => void;
}

export const TabletHeader: React.FC<TabletHeaderProps> = ({
  shouldFixHeader,
  isScrolled,
  profileHref,
  locationInfo,
  onMenuToggle,
  onNavClick,
  onSearch,
  onSuggestionClick,
  onLocationClick,
}) => {
  const isActive = (path: string) => window.location.pathname === path;

  return (
    <>
      {/* Spacer for fixed header */}
      {shouldFixHeader && (
        <div className="hidden sm:block lg:hidden h-[130px]" />
      )}

      <header
        className={`hidden sm:block lg:hidden w-full bg-emerald-800 transition-all duration-300 ${
          shouldFixHeader
            ? "fixed top-0 left-0 z-50 animate-slideDown"
            : "relative"
        } ${isScrolled ? "shadow-lg" : ""}`}
      >
        <div className="border-b border-white/10">
          {/* Top row - Menu, Logo, Location, and Icons */}
          <div className="flex items-center justify-between py-2 px-4">
            {/* Left side - Menu and Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={onMenuToggle}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                <Menu size={22} className="text-white" />
              </button>

              <Link
                to="/"
                onClick={(e) => onNavClick(e, "/")}
                className="hover:bg-white/10 transition-colors rounded-lg"
              >
                <img
                  src="/logo_white_details.jpeg"
                  alt="Home"
                  className="h-[60px]"
                />
              </Link>
            </div>

            {/* Right side - Location and Icons */}
            <div className="flex items-center gap-3">
              {/* Location Display */}
              <button
                onClick={onLocationClick}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <LocationDisplay locationInfo={locationInfo} isCompact />
              </button>
                <SearchAutoComplete
                  placeholder="Search for products..."
                  onSearch={onSearch}
                  onSuggestionClick={onSuggestionClick}
                  className="w-full"
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
