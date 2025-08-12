// components/checkout/UserInfo.tsx
import React from "react";
import {
  UserCircle,
  Phone,
  Mail,
  Crown,
  CheckCircle,
  LogOut
} from "lucide-react";
import type { User } from "../../../types/user.types";

interface UserInfoProps {
  user: User | null;
  onChangeClick: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onChangeClick }) => {
  const isGuest = !user;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <UserCircle className="h-10 w-10 text-white" />
            </div>
            {user && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {user?.name || "Guest User"}
              </h3>
              {user?.isAdmin && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  <Crown className="h-3 w-3" />
                  <span>ADMIN</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {user?.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{user.phone}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              )}

              {user?.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{user.email}</span>
                </div>
              )}

              {!user?.phone && !user?.email && (
                <p className="text-sm text-gray-500 italic">
                  No contact information available
                </p>
              )}
            </div>

            {user && (
              <div className="mt-3">
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

        <button
          onClick={onChangeClick}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300"
        >
          <LogOut className="h-4 w-4" />
          <span>{isGuest ? "LOGIN" : "LOGOUT"}</span>
        </button>
      </div>

      {isGuest && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
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
