// components/Header/MobileMenu.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronDown, Heart, User, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import { selectCart } from "../../redux/slice/cart";
import { fetchCategories } from "../../redux/slice/categories";
import type { Category as Categories } from "../../types/products.types";
import { CartIcon } from "./CartIcon";
import type { NavItem } from "./Navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  profileHref: string;
  profileLabel: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  profileHref,
  profileLabel,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartLoading = useAppSelector(
    (state) => state.cart.status === "loading"
  );
  const cart = useAppSelector(selectCart);
  const { status, categories } = useAppSelector((state) => state.categories);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const cartCount = cart?.summary.totalItems || 0;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    window.open(path, "_self");
    onClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    const url = `/products?category=${encodeURIComponent(categoryName)}`;
    handleNavigation(url);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-80"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-72 bg-white z-90 transform transition-transform duration-300 ease-out shadow-2xl translate-x-0">
        <div className="flex items-center justify-between p-4 border-b bg-emerald-900">
          <h2 className="text-lg font-bold text-white">Clover Arena</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-73px)]">
          {navItems.map((item) =>
            item.isDropdown ? (
              <div
                key={item.name}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                {/* Main Category Header */}
                <div className="flex items-center bg-white rounded-lg shadow-sm">
                  <button
                    className={`flex-1 text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors ${
                      isActive(item.path)
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.name}
                  </button>
                  <button
                    className={`px-4 py-3 text-gray-500 hover:text-blue-600 transition-all duration-200 border-l border-gray-100 ${
                      dropdownOpen ? "text-blue-600" : ""
                    }`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <ChevronDown
                      className={`transform transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      size={16}
                    />
                  </button>
                </div>

                {/* Categories Dropdown */}
                {dropdownOpen && categories && (
                  <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {categories.map((parent: Categories) => (
                      <div
                        key={parent.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="flex items-center">
                          <button
                            className="flex-1 text-left px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                            onClick={() => handleCategoryClick(parent.name)}
                          >
                            {parent.name}
                          </button>

                          {parent.children && parent.children.length > 0 && (
                            <button
                              className={`px-3 py-3 text-gray-400 hover:text-blue-600 transition-all duration-200 ${
                                expandedCategories.has(parent.id)
                                  ? "text-blue-600 bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => toggleCategoryExpansion(parent.id)}
                            >
                              <ChevronDown
                                className={`transform transition-transform duration-200 ${
                                  expandedCategories.has(parent.id)
                                    ? "rotate-180"
                                    : ""
                                }`}
                                size={14}
                              />
                            </button>
                          )}
                        </div>

                        {/* Child Categories */}
                        {expandedCategories.has(parent.id) &&
                          parent.children &&
                          parent.children.length > 0 && (
                            <div className="bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-1 duration-200">
                              {parent.children.map((child) => (
                                <button
                                  key={child.id}
                                  className="w-full text-left px-6 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-150 border-l-3 border-transparent hover:border-blue-200"
                                  onClick={() =>
                                    handleCategoryClick(child.name)
                                  }
                                >
                                  {child.name}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.path);
                }}
              >
                {item.name}
              </Link>
            )
          )}

          {/* User Actions Section */}
          <div className="pt-4 mt-6 border-t border-gray-200 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
              Your Account
            </h3>

            <Link
              to="/wishlist"
              className={`flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive("/wishlist")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/wishlist");
              }}
            >
              <Heart
                size={18}
                fill={isActive("/wishlist") ? "currentColor" : "none"}
                className="transition-all duration-200"
              />
              <span>Wishlist</span>
            </Link>

            <Link
              to="/cart"
              className={`flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive("/cart")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/cart");
              }}
            >
              <CartIcon size={18} showCount={false} />
              <span className="flex items-center gap-2">
                Cart
                {cartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : cartCount > 0 ? (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {cartCount}
                  </span>
                ) : null}
              </span>
            </Link>

            <Link
              to={profileHref}
              className={`flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(profileHref)
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(profileHref);
              }}
            >
              <User
                size={18}
                fill={isActive(profileHref) ? "currentColor" : "none"}
                className="transition-all duration-200"
              />
              <span>{profileLabel}</span>
            </Link>
          </div>

          {/* Cart Summary */}
          {cart && cart.items.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Cart Total</span>
                  <span className="text-xs text-gray-500">
                    {cartCount} items
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  ₹{cart.summary.totalPrice.toFixed(2)}
                </p>
              </div>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                onClick={() => handleNavigation("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
