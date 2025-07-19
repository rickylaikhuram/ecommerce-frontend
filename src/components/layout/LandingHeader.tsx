import {
  Search,
  User,
  MapPin,
  Heart,
  ShoppingCart,
  Menu,
  Home,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// import { useCart } from "../context/CartContext";

/* …inside the component … */
const LandingHeader = () => {
  const { authStatus } = useAuth(); // <── who am I?
  const isGuest = authStatus?.role === "guest";
  const profileHref = isGuest ? "/signin" : "/account"; // dynamic path
  const profileLabel = isGuest ? "Sign in" : "Profile"; // optional text
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldFixHeader, setShouldFixHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const location = useLocation();

  // Track last clicked link for double-click detection
  const lastClickRef = useRef({ path: "", timestamp: 0 });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // const { cartItems } = useCart();
  // const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

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

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "MEN", path: "/men" },
    { name: "WOMEN", path: "/women" },
    { name: "SNEAKERS", path: "/sneakers" },
    { name: "NEW ARRIVALS", path: "/new" },
    { name: "CLEARANCE", path: "/clearance" },
  ];

  // Check if route is active
  const isActive = (path: any) => location.pathname === path;

  // Handle navigation click with double-click detection
  const handleNavClick = (e: any, path: any) => {
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
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block py-2.5 px-3 text-sm font-medium rounded-lg transition-all
               duration-200 text-gray-800 hover:bg-gray-50 hover:text-blue-600"
              onClick={(e) => {
                handleNavClick(e, item.path);
                toggleMenu();
              }}
            >
              {item.name}
            </Link>
          ))}

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
              <nav className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-medium transition-colors
             ${
               isActive(item.path)
                 ? "text-blue-600"
                 : "text-gray-700 hover:text-blue-600"
             }`}
                    onClick={(e) => handleNavClick(e, item.path)}
                  >
                    {item.name}
                  </Link>
                ))}
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
                  to={profileHref} // <<— dynamic
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
                      : "hover: text-gray-700"
                  }`}
                  onClick={(e) => handleNavClick(e, "/location")}
                >
                  <MapPin
                    size={20}
                    fill={isActive("/location") ? "currentColor" : "none"}
                  />
                </Link>

                {/* <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors hidden md:block">
                  <MapPin size={20} className="text-gray-700" />
                </button> */}

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

                <Link
                  to="/cart"
                  className={`p-2.5 rounded-lg transition-colors relative ${
                    isActive("/cart")
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={(e) => handleNavClick(e, "/cart")}
                >
                  <ShoppingCart
                    size={20}
                    fill={isActive("/cart") ? "currentColor" : "none"}
                  />
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
            <ShoppingCart
              size={20}
              strokeWidth={1.5}
              fill={isActive("/cart") ? "currentColor" : "none"}
            />
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
