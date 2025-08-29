// components/Header/MobileBottomNav.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, User } from "lucide-react";
import { CartIcon } from "./CartIcon";

interface MobileBottomNavProps {
  showHeader: boolean;
  isScrolled: boolean;
  profileHref: string;
  profileLabel: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  showHeader,
  isScrolled,
  profileHref,
  profileLabel,
  onNavClick,
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/wishlist", icon: Heart, label: "Wishlist" },
    { path: "/cart", label: "Cart" },
    { path: profileHref, icon: User, label: profileLabel },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-40 transition-transform duration-300 ${
        !showHeader && isScrolled ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-2 transition-colors relative ${
              isActive(item.path)
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={(e) => onNavClick(e, item.path)}
          >
            {item.path === "/cart" ? (
              <CartIcon size={20} />
            ) : (
              item.icon && (
                <item.icon
                  size={20}
                  strokeWidth={1.5}
                  fill={isActive(item.path) ? "currentColor" : "none"}
                />
              )
            )}

            <span
              className={`text-[10px] font-medium mt-1 ${
                isActive(item.path) ? "font-semibold" : ""
              }`}
            >
              {item.label}
            </span>
            {isActive(item.path) && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-blue-600 rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};
