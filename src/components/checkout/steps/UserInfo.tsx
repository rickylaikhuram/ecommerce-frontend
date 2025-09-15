// components/checkout/UserInfo.tsx
import React from "react";
import { UserCircle, Phone, Mail, CheckCircle, LogOut } from "lucide-react";
import type { UserProfile } from "../../../types/user.types";

interface UserInfoProps {
  user: UserProfile | null;
  onChangeClick: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onChangeClick }) => {
  const isGuest = !user;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-emerald-100">
      {/* Mobile and Desktop Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* User Avatar and Info Section */}
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <UserCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            {user && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 sm:p-1">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {user?.name || "Guest User"}
              </h3>
            </div>

            {/* Contact Information */}
            <div className="space-y-1.5 sm:space-y-2">
              {user?.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">
                    {user.phone}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Verified
                  </span>
                </div>
              )}

              {user?.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                    {user.email}
                  </span>
                </div>
              )}

              {!user?.phone && !user?.email && (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  No contact information available
                </p>
              )}
            </div>

            {/* Account Status - Hidden on small screens, shown on larger */}
            {user && (
              <div className="mt-2 sm:mt-3 hidden sm:block">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Account Active</span>
                  </span>
                  <span>
                    Member since{" "}
                    {new Date(user.createdAt || Date.now()).getFullYear()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end sm:justify-start">
          <button
            onClick={onChangeClick}
            className="flex items-center justify-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-emerald-200 hover:border-emerald-300 w-full sm:w-auto text-sm sm:text-base"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{isGuest ? "LOGIN" : "LOGOUT"}</span>
          </button>
        </div>
      </div>

      {/* Account Status for Mobile - Shown only on small screens when user exists */}
      {user && (
        <div className="mt-3 sm:hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Account Active</span>
            </span>
            <span>
              Member since{" "}
              {new Date(user.createdAt || Date.now()).getFullYear()}
            </span>
          </div>
        </div>
      )}

      {/* Guest Notice */}
      {isGuest && (
        <div className="mt-4 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-orange-800">
                Continue as guest or sign in
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Create an account to track your orders and save your preferences
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
