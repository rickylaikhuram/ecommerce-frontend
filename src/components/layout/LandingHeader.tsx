// components/LandingHeader.tsx
import {
  Search,
  User,
  MapPin,
  Heart,
  ShoppingCart,
  Menu,
  Home,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCartContext } from "../../context/CartContext";

type NavItem =
  | { name: string; path: string; isDropdown?: false }
  | {
      name: string;
      isDropdown: true;
      items: { label: string; path: string }[];
    };

const LandingHeader = () => {
  const { authStatus } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldFixHeader, setShouldFixHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const location = useLocation();

  // Determine if user is authenticated based on authStatus
  const isAuthenticated = authStatus?.isAuthenticated === true;
  const isGuest = !isAuthenticated || authStatus?.role === "guest";

  // Set profile navigation based on auth state
  const profileHref = isGuest ? "/signin" : "/account/profile";
  const profileLabel = isGuest ? "Sign in" : "Profile";

  // Track last clicked link for double-click detection
  const lastClickRef = useRef({ path: "", timestamp: 0 });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Get cart data from context
  const { cart, loading: cartLoading } = useCartContext();
  const cartCount = cart?.summary.totalItems || 0;

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // For mobile hide/show behavior
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      // Desktop: header becomes fixed after scrolling 150px
      setShouldFixHeader(currentScrollY > 150);

      // Add shadow after scrolling 20px
      setIsScrolled(currentScrollY > 20);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    {
      name: "Categories",
      isDropdown: true,
      items: [
        { label: "Club", path: "/category/men" },
        { label: "National", path: "/category/women" },
      ],
    },
  ];

  // Check if route is active
  const isActive = (path: string) => location.pathname === path;

  // Handle navigation click with double-click detection
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickRef.current.timestamp;

    // If same path clicked within 500ms and already on that page, scroll to top
    if (
      lastClickRef.current.path === path &&
      timeDiff < 500 &&
      location.pathname === path
    ) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Reset after double click
      lastClickRef.current = { path: "", timestamp: 0 };
    } else {
      // Update last click info
      lastClickRef.current = { path, timestamp: currentTime };
    }

    // Close menu if open
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  // Cart Icon Component with loading state
  const CartIcon = ({
    size = 20,
    showCount = true,
  }: {
    size?: number;
    showCount?: boolean;
    className?: string;
  }) => (
    <div className="relative">
      <ShoppingCart
        size={size}
        strokeWidth={1.5}
        fill={isActive("/cart") ? "currentColor" : "none"}
      />
      {showCount && cartCount > 0 && !cartLoading && (
        <span
          className={`absolute -top-2 -right-2 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold ${
            size > 20 ? "text-xs h-5 w-5" : "text-[10px] h-4 w-4"
          }`}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
      {showCount && cartLoading && (
        <span className="absolute -top-2 -right-2 bg-gray-300 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={toggleMenu}
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
                          handleNavClick(e, subItem.path);
                          toggleMenu();
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
                  handleNavClick(e, item.path);
                  toggleMenu();
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
              onClick={(e) => handleNavClick(e, "/wishlist")}
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
              onClick={(e) => handleNavClick(e, "/cart")}
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
              className={`flex items-center gap-3 py-2.5 px-3 text-sm font-medium
              rounded-lg transition-all duration-200
              ${
                isActive(profileHref)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-800 hover:bg-gray-50 hover:text-blue-600"
              }`}
              onClick={(e) => handleNavClick(e, profileHref)}
            >
              <User
                size={16}
                fill={isActive(profileHref) ? "currentColor" : "none"}
              />
              {profileLabel}
            </Link>
          </div>

          {/* Cart Summary in Mobile Menu */}
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
                onClick={toggleMenu}
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Header Spacer - only when fixed */}
      {shouldFixHeader && <div className="hidden sm:block h-[73px]" />}

      {/* Desktop Header */}
      <header
        className={`hidden sm:block w-full bg-white transition-all duration-300 ${
          shouldFixHeader
            ? "fixed top-0 left-0 z-50 animate-slideDown"
            : "relative"
        } ${isScrolled ? "shadow-lg" : ""}`}
      >
        <div className="border-b border-gray-100">
          <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <button
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <Menu size={24} className="text-gray-700" />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8 relative">
                {navItems.map((item) =>
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
                            onClick={(e) => handleNavClick(e, subItem.path)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path!} // Add non-null assertion since we know non-dropdown items have path
                      className={`text-sm font-medium transition-colors ${
                        isActive(item.path!) // Add non-null assertion here too
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                      onClick={(e) => handleNavClick(e, item.path!)} // And here
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 xl:w-80 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              {/* Icons */}
              <div className="flex items-center gap-2">
                <Link
                  to={profileHref}
                  className={`p-2.5 rounded-lg transition-colors
                    ${
                      isActive(profileHref)
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  onClick={(e) => handleNavClick(e, profileHref)}
                >
                  <User
                    size={20}
                    fill={isActive(profileHref) ? "currentColor" : "none"}
                  />
                </Link>
                <Link
                  to="/location"
                  className={`p-2.5 rounded-lg transition-colors relative ${
                    isActive("/location")
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={(e) => handleNavClick(e, "/location")}
                >
                  <MapPin
                    size={20}
                    fill={isActive("/location") ? "currentColor" : "none"}
                  />
                </Link>

                <Link
                  to="/wishlist"
                  className={`p-2.5 rounded-lg transition-colors relative ${
                    isActive("/wishlist")
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={(e) => handleNavClick(e, "/wishlist")}
                >
                  <Heart
                    size={20}
                    fill={isActive("/wishlist") ? "currentColor" : "none"}
                  />
                </Link>

                {/* Cart with MiniCart - Desktop */}
                <Link
                  to="/cart"
                  className={`p-2.5 rounded-lg transition-colors relative ${
                    isActive("/cart")
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={(e) => handleNavClick(e, "/cart")}
                >
                  <CartIcon size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className={`sm:hidden w-full bg-white transition-transform duration-300 ${
          isScrolled ? "fixed top-0 left-0 z-40 shadow-md" : "relative"
        } ${!showHeader && isScrolled ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="border-b border-gray-100">
          <div className="flex items-center gap-2 p-3">
            <button
              onClick={toggleMenu}
              className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu size={20} className="text-gray-700" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>

            {/* Cart preview for mobile header */}
            <Link
              to="/cart"
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <CartIcon size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-40 transition-transform duration-300 ${
          !showHeader && isScrolled ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="grid grid-cols-4 items-center">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 transition-colors relative ${
              isActive("/")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={(e) => handleNavClick(e, "/")}
          >
            <Home
              size={20}
              strokeWidth={1.5}
              fill={isActive("/") ? "currentColor" : "none"}
            />
            <span
              className={`text-[10px] font-medium mt-1 ${
                isActive("/") ? "font-semibold" : ""
              }`}
            >
              Home
            </span>
            {isActive("/") && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-blue-600 rounded-full" />
            )}
          </Link>

          <Link
            to="/wishlist"
            className={`relative flex flex-col items-center py-2 transition-colors ${
              isActive("/wishlist")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={(e) => handleNavClick(e, "/wishlist")}
          >
            <Heart
              size={20}
              strokeWidth={1.5}
              fill={isActive("/wishlist") ? "currentColor" : "none"}
            />
            <span
              className={`text-[10px] font-medium mt-1 ${
                isActive("/wishlist") ? "font-semibold" : ""
              }`}
            >
              Wishlist
            </span>
            {isActive("/wishlist") && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-blue-600 rounded-full" />
            )}
          </Link>

          <Link
            to="/cart"
            className={`relative flex flex-col items-center py-2 transition-colors ${
              isActive("/cart")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={(e) => handleNavClick(e, "/cart")}
          >
            <CartIcon size={20} />
            <span
              className={`text-[10px] font-medium mt-1 ${
                isActive("/cart") ? "font-semibold" : ""
              }`}
            >
              Cart
            </span>
            {isActive("/cart") && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-blue-600 rounded-full" />
            )}
          </Link>

          <Link
            to={profileHref}
            className={`flex flex-col items-center py-2 transition-colors relative
              ${
                isActive(profileHref)
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            onClick={(e) => handleNavClick(e, profileHref)}
          >
            <User
              size={20}
              strokeWidth={1.5}
              fill={isActive(profileHref) ? "currentColor" : "none"}
            />
            <span
              className={`text-[10px] font-medium mt-1
                ${isActive(profileHref) ? "font-semibold" : ""}`}
            >
              {profileLabel}
            </span>
            {isActive(profileHref) && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2
                    w-10 h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </Link>
        </div>
      </nav>
    </>
  );
};

export default LandingHeader;
