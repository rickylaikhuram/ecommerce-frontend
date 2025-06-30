import {
  FaSearch,
  FaUser,
  FaMapMarkerAlt,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaHome,
} from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LandingHeaderProps {
  wishlistCount: number;
  cartCount: number;
}

const LandingHeader = ({ wishlistCount, cartCount }: LandingHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Overlay when sidebar is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-30"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-20 p-6 space-y-6 overflow-y-auto h-full">
          {["MEN", "WOMEN", "SNEAKERS", "NEW ARRIVALS", "CLEARANCE"].map(
            (item) => (
              <Link
                key={item}
                to="#"
                className="block text-lg font-medium text-gray-900 hover:text-orange-500 uppercase"
                onClick={toggleMenu}
              >
                {item}
              </Link>
            )
          )}
          <Link
            to="/wishlist"
            className="flex items-center text-lg font-medium text-gray-900 hover:text-orange-500 uppercase"
            onClick={toggleMenu}
          >
            Wishlist
            {wishlistCount > 0 && (
              <span className="ml-2 text-orange-500">({wishlistCount})</span>
            )}
          </Link>
          <Link
            to="/signin"
            className="block text-lg font-medium text-gray-900 hover:text-orange-500 uppercase"
            onClick={toggleMenu}
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Top Navbar for Desktop */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md hidden sm:flex">
        <div className="flex items-center justify-between w-full py-4 px-4 sm:px-6 lg:px-8">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-orange-500 z-50"
          >
            <FaBars className="text-2xl" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative max-w-xs w-full hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
            </div>

            <Link to="/signin">
              <FaUser className="text-xl text-gray-700 hover:text-orange-500" />
            </Link>

            <FaMapMarkerAlt className="hidden md:block text-xl text-gray-700 hover:text-orange-500 cursor-pointer" />

            <Link to="/wishlist" className="relative">
              <FaHeart className="text-xl text-gray-700 hover:text-orange-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-xl text-gray-700 hover:text-orange-500" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Top Navbar for Mobile */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex sm:hidden">
        <div className="flex items-center justify-between w-full py-4 px-4">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-orange-500"
          >
            <FaBars className="text-2xl" />
          </button>
          <div className="relative w-full max-w-xs mx-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Bottom Navbar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-200 sm:hidden z-50">
        <div className="flex justify-around items-center py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-700 hover:text-orange-500 text-sm"
          >
            <FaHome className="text-xl" />
            <span>Home</span>
          </Link>

          <Link
            to="/wishlist"
            className="relative flex flex-col items-center text-gray-700 hover:text-orange-500 text-sm"
          >
            <FaHeart className="text-xl" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-gray-700 hover:text-orange-500 text-sm"
          >
            <FaShoppingCart className="text-xl" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/signin"
            className="flex flex-col items-center text-gray-700 hover:text-orange-500 text-sm"
          >
            <FaUser className="text-xl" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingHeader;
