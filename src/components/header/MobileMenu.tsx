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
        <div className="flex items-center justify-between p-2 pr-5 border-b bg-emerald-900">
          <img
            src="/logo_white_details.jpeg"
            alt="Home"
            className="h-19 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-50 "
          />
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
                    className={`flex-1 text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors ${
                      isActive(item.path)
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.name}
                  </button>
                  <button
                    className={`px-4 py-3 text-gray-500 hover:text-emerald-600 transition-all duration-200 border-l border-gray-100 ${
                      dropdownOpen ? "text-emerald-600" : ""
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
                            className="flex-1 text-left px-4 py-3 text-sm text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-150"
                            onClick={() => handleCategoryClick(parent.name)}
                          >
                            {parent.name}
                          </button>

                          {parent.children && parent.children.length > 0 && (
                            <button
                              className={`px-3 py-3 text-gray-400 hover:text-emerald-600 transition-all duration-200 ${
                                expandedCategories.has(parent.id)
                                  ? "text-emerald-600 bg-emerald-50"
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
                                  className="w-full text-left px-6 py-2.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-white transition-all duration-150 border-0 border-l-[3px] border-transparent hover:border-emerald-200"
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
          <a
            href="https://wa.me/+918416082998"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 item-center  px-4 pt-3 text-sm font-medium rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488z" />
            </svg>
            24/7 Chat Support
          </a>
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
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
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
              <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-lg p-4 mb-4 border border-emerald-100">
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
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-indigo-700 text-white text-center py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
