// components/UserSidebar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaHeart,
  FaCreditCard,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt,
  FaBox,
  FaWallet,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const UserSidebar: React.FC = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    await logout();
    navigate("/signin"); // or wherever you want to redirect
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
      icon: <FaBox className="w-5 h-5" />,
      label: "Returns & Refunds",
      path: "/account/returns",
    },
    {
      icon: <FaHeart className="w-5 h-5" />,
      label: "Wishlist",
      path: "/account/wishlist",
    },
    {
      icon: <FaCreditCard className="w-5 h-5" />,
      label: "Payment Methods",
      path: "/account/payment-methods",
    },
    {
      icon: <FaWallet className="w-5 h-5" />,
      label: "Wallet",
      path: "/account/wallet",
    },
    {
      icon: <FaBell className="w-5 h-5" />,
      label: "Notifications",
      path: "/account/notifications",
    },
    {
      icon: <FaShieldAlt className="w-5 h-5" />,
      label: "Security",
      path: "/account/security",
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Account</h2>
        <p className="text-gray-600 text-sm">Manage your account settings</p>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
