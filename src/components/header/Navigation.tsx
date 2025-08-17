// components/Header/Navigation.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export type NavItem =
  | { name: string; path: string; isDropdown?: false }
  | {
      name: string;
      isDropdown: true;
      items: { label: string; path: string }[];
    };

interface NavigationProps {
  items: NavItem[];
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  onNavClick,
  className = "",
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`flex items-center gap-8 relative ${className}`}>
      {items.map((item) =>
        item.isDropdown ? (
          <div key={item.name} className="relative group">
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1">
              {item.name}
              <ChevronDown size={16} />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30">
              {item.items?.map((subItem) => (
                <Link
                  key={subItem.label}
                  to={subItem.path}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  onClick={(e) => onNavClick(e, subItem.path)}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            key={item.name}
            to={item.path!}
            className={`text-sm font-medium transition-colors ${
              isActive(item.path!)
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
            onClick={(e) => onNavClick(e, item.path!)}
          >
            {item.name}
          </Link>
        )
      )}
    </nav>
  );
};