// components/UserSidebar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaHeart,
  FaShieldAlt,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import { useAppDispatch } from "../../redux/hook";
import { logoutUser } from "../../redux/slice/auth";
import WarningModal from "../../components/common/WarningModal";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const UserSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsLogoutModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const sidebarItems: SidebarItem[] = [
    {
      icon: <FaUser className="w-5 h-5" />,
      label: "Account Details",
      path: "/account/profile",
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      label: "Addresses",
      path: "/account/addresses",
    },
    {
      icon: <FaShoppingBag className="w-5 h-5" />,
      label: "Orders",
      path: "/account/orders",
    },
    {
      icon: <FaHeart className="w-5 h-5" />,
      label: "Wishlist",
      path: "/account/wishlist",
    },
    {
      icon: <FaShieldAlt className="w-5 h-5" />,
      label: "Security",
      path: "/account/security",
    },
  ];

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 ">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">My Account</h2>
          <p className="text-gray-600 text-sm">Manage your account settings</p>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === item.path
                  ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {/* Show chevron on mobile for better UX indication */}
              <FaChevronRight className="w-4 h-4 md:hidden text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <WarningModal
        isOpen={isLogoutModalOpen}
        onClose={handleCancelLogout}
        title="Confirm Logout"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaSignOutAlt className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure you want to logout?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            You will be redirected to the sign-in page and will need to log in
            again to access your account.
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={handleCancelLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </WarningModal>
    </>
  );
};

export default UserSidebar;
