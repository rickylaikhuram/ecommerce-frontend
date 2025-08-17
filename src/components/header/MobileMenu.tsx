// components/Header/MobileMenu.tsx
import React from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown, Heart, User, Loader2 } from "lucide-react";
import { useCartContext } from "../../context/CartContext";
import { CartIcon } from "./CartIcon";
import type { NavItem } from "./Navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  profileHref: string;
  profileLabel: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  profileHref,
  profileLabel,
  onNavClick,
}) => {
  const { cart, loading: cartLoading } = useCartContext();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const cartCount = cart?.summary.totalItems || 0;

  const isActive = (path: string) => window.location.pathname === path;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl translate-x-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-73px)]">
          {navItems.map((item) =>
            item.isDropdown ? (
              <div key={item.name}>
                <button
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {item.name}
                  <ChevronDown
                    className={`transform transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
                {dropdownOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        onClick={(e) => {
                          onNavClick(e, subItem.path);
                          onClose();
                        }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={(e) => {
                  onNavClick(e, item.path);
                  onClose();
                }}
              >
                {item.name}
              </Link>
            )
          )}

          <div className="pt-4 mt-4 border-t space-y-1">
            <Link
              to="/wishlist"
              className={`flex items-center gap-3 py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive("/wishlist")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-800 hover:bg-gray-50 hover:text-blue-600"
              }`}
              onClick={(e) => onNavClick(e, "/wishlist")}
            >
              <Heart
                size={16}
                fill={isActive("/wishlist") ? "currentColor" : "none"}
              />
              Wishlist
            </Link>
            
            <Link
              to="/cart"
              className={`flex items-center gap-3 py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive("/cart")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-800 hover:bg-gray-50 hover:text-blue-600"
              }`}
              onClick={(e) => onNavClick(e, "/cart")}
            >
              <CartIcon size={16} showCount={false} />
              <span className="flex items-center gap-1">
                Cart
                {cartLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : cartCount > 0 ? (
                  <span className="text-blue-600 font-semibold">
                    ({cartCount})
                  </span>
                ) : null}
              </span>
            </Link>
            
            <Link
              to={profileHref}
              className={`flex items-center gap-3 py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(profileHref)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-800 hover:bg-gray-50 hover:text-blue-600"
              }`}
              onClick={(e) => onNavClick(e, profileHref)}
            >
              <User
                size={16}
                fill={isActive(profileHref) ? "currentColor" : "none"}
              />
              {profileLabel}
            </Link>
          </div>

          {/* Cart Summary */}
          {cart && cart.items.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-600 mb-1">Cart Total</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{cart.summary.totalPrice.toFixed(2)}
                </p>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={onClose}
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
