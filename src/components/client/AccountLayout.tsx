// components/AccountLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import UserSidebar from "../../pages/client/UserSidebar";

const AccountLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle mobile navigation
  useEffect(() => {
    if (isMobile) {
      // Show sidebar only on account root path
      setShowSidebar(
        location.pathname === "/account" || location.pathname === "/account/"
      );
    } else {
      // Always show sidebar on desktop
      setShowSidebar(true);
    }
  }, [location.pathname, isMobile]);

  const handleBackToMenu = () => {
    navigate("/account");
  };

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/profile")) return "Account Details";
    if (path.includes("/addresses")) return "Addresses";
    if (path.includes("/orders")) return "Orders";
    if (path.includes("/wishlist")) return "Wishlist";
    if (path.includes("/security")) return "Security";
    return "Account";
  };

  if (isMobile) {
    return (
      <div className=" bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {showSidebar ? (
            // Show sidebar as main menu on mobile
            <UserSidebar />
          ) : (
            // Show page content with back button on mobile
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <FaArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">
                  {getPageTitle()}
                </h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm">
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout (unchanged)
  return (
    <div className=" bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <UserSidebar />
          </div>
          <div className="md:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
