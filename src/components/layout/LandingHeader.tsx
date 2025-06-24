import {
  FaSearch,
  FaUser,
  FaMapMarkerAlt,
  FaHeart,
  FaShoppingCart,
  FaBars,
  
} from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LandingHeaderProps {
  wishlistCount: number;
}

const LandingHeader = ({ wishlistCount }: LandingHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Overlay when sidebar is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0  bg-opacity-30 backdrop-blur-sm z-30"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-5 left-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between mb-4">
            
          </div>
          {["MEN", "WOMEN", "SNEAKERS", "NEW ARRIVALS", "CLEARANCE"].map(
            (item) => (
              <Link
                key={item}
                to="#"
                className="block text-lg font-medium text-gray-900 hover:text-orange-500 uppercase"
              >
                {item}
              </Link>
            )
          )}
          <Link
            to="/wishlist"
            className="flex items-center text-lg font-medium text-gray-900 hover:text-orange-500 uppercase"
          >
            Wishlist
            {wishlistCount > 0 && (
              <span className="ml-2 text-orange-500">({wishlistCount})</span>
            )}
          </Link>
        </div>
      </div>

      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
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
            <FaUser className="text-xl text-gray-700 hover:text-orange-500 cursor-pointer" />
            <FaMapMarkerAlt className="hidden md:block text-xl text-gray-700 hover:text-orange-500 cursor-pointer" />
            <Link to="/wishlist" className="relative">
              <FaHeart className="text-xl text-gray-700 hover:text-orange-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <div className="relative">
              <FaShoppingCart className="text-xl text-gray-700 hover:text-orange-500" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHeader;
