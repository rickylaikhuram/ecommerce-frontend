// components/Header/Navigation.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { fetchCategories } from "../../redux/slice/categories";
import type { Category as Categories } from "../../types/products.types";
export type NavItem =
  | { name: string; path: string; isDropdown?: false }
  | {
      name: string;
      path: string;
      isDropdown: true;
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
  const dispatch = useAppDispatch();

  const { status, categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const [isOpen, setIsOpen] = useState(false);
  const [openParent, setOpenParent] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenParent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    const url = `/products?category=${encodeURIComponent(categoryName)}`;
    window.open(url, "_self");
    setIsOpen(false);
    setOpenParent(null);
  };

  return (
    <nav className={`flex items-center gap-8 relative ${className}`}>
      {items.map((item) =>
        item.isDropdown ? (
          <div
            key={item.name}
            className="relative flex items-center"
            ref={dropdownRef}
          >
            {/* Parent Category Link and Dropdown Button Combined */}
            <div className="flex items-center bg-white hover:bg-gray-50 rounded-lg transition-all duration-200">
              <Link
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-l-lg ${
                  isActive(item.path)
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
                onClick={(e) => onNavClick(e, item.path)}
              >
                {item.name}
              </Link>

              <button
                className={`px-2 py-2 text-sm font-medium transition-all duration-300 rounded-r-lg border-l border-gray-200 ${
                  isOpen
                    ? "text-emerald-600 bg-emerald-50 shadow-sm"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>

            {/* Enhanced Dropdown Menu */}
            {isOpen && categories && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl min-w-[200px] shadow-xl z-30 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="py-1">
                  {categories.map((parent: Categories) => (
                    <div key={parent.id} className="relative group">
                      <div className="flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
                        <button
                          className="flex-1 text-left px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 font-medium"
                          onClick={() => handleCategoryClick(parent.name)}
                        >
                          {parent.name}
                        </button>

                        {parent.children && parent.children.length > 0 && (
                          <button
                            className={`px-3 py-3 text-gray-500 hover:text-emerald-600 transition-all duration-200 ${
                              openParent === parent.id
                                ? "text-emerald-600 bg-emerald-50"
                                : ""
                            }`}
                            onClick={() =>
                              setOpenParent(
                                openParent === parent.id ? null : parent.id
                              )
                            }
                          >
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                openParent === parent.id
                                  ? "rotate-180"
                                  : "rotate-0"
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Child Categories Submenu */}
                      {openParent === parent.id &&
                        parent.children &&
                        parent.children.length > 0 && (
                          <div className="bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-1 duration-200">
                            <div className="py-1">
                              {parent.children.map((child) => (
                                <button
                                  key={child.id}
                                  className="w-full text-left px-7 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-white transition-colors duration-150 border-l-2 border-transparent hover:border-emerald-200"
                                  onClick={() =>
                                    handleCategoryClick(child.name)
                                  }
                                >
                                  {child.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            key={item.name}
            to={item.path}
            onClick={(e) => onNavClick(e, item.path)}
          >
            {item.name === "Home" ? (
              <img
                src="/logo_details.jpeg"
                alt="Home"
                className={`h-19 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-50 `}
              />
            ) : (
              <span
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-50 ${
                  isActive(item.path)
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                {item.name}
              </span>
            )}
          </Link>
        )
      )}
    </nav>
  );
};
