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
    <nav className={`flex items-center gap-2 relative ${className}`}>
      {items.map((item) =>
        item.isDropdown ? (
          <div
            key={item.name}
            className="relative flex items-center"
            ref={dropdownRef}
          >
            {/* Modern Dropdown Button with White Text */}
            <div className="flex items-center">
              <Link
                to={item.path}
                className={`px-4 py-2.5 text-md font-medium transition-all duration-200 rounded-l-md ${
                  isActive(item.path)
                    ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                    : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                }`}
                onClick={(e) => onNavClick(e, item.path)}
              >
                {item.name}
              </Link>

              <button
                className={`px-3 py-2.5 text-md font-medium transition-all duration-200 rounded-r-md border-l border-white/20 ${
                  isOpen
                    ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                    : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                } ${
                  isActive(item.path) && !isOpen ? "bg-white/20 text-white" : ""
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>

            {/* Modern Dropdown Menu */}
            {isOpen && categories && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg min-w-[220px] shadow-xl z-30 overflow-hidden backdrop-blur-md">
                <div className="py-2">
                  {categories.map((parent: Categories) => (
                    <div key={parent.id} className="relative">
                      <div className="flex items-center justify-between hover:bg-emerald-50 transition-colors duration-150">
                        <button
                          className="flex-1 text-left px-4 py-2.5 text-sm text-gray-700 hover:text-emerald-600 font-medium"
                          onClick={() => handleCategoryClick(parent.name)}
                        >
                          {parent.name}
                        </button>

                        {parent.children && parent.children.length > 0 && (
                          <button
                            className={`px-3 py-2.5 text-gray-400 hover:text-emerald-600 transition-all duration-200 ${
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
                          <div className="bg-gray-50 border-t border-gray-100">
                            <div className="py-1">
                              {parent.children.map((child) => (
                                <button
                                  key={child.id}
                                  className="w-full text-left px-8 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-white transition-colors duration-150 border-l-2 border-transparent hover:border-emerald-500"
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
                src="/logo_white_details.jpeg"
                alt="Home"
                className="h-[70px] w-auto"
              />
            ) : (
              <span
                className={`px-4 py-2.5 text-md font-medium transition-all duration-200 rounded-md ${
                  isActive(item.path)
                    ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                    : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
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
