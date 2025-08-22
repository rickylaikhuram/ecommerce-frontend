// components/UserAvatar.tsx
import React from "react";
import { Users, Shield } from "lucide-react";

interface UserAvatarProps {
  isAdmin?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ isAdmin = false }) => {
  const gradientClass = isAdmin
    ? "from-purple-500 to-blue-500"
    : "from-blue-500 to-green-500";

  const Icon = isAdmin ? Shield : Users;

  return (
    <div
      className={`flex-shrink-0 h-10 w-10 bg-gradient-to-r ${gradientClass} rounded-full flex items-center justify-center`}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
  );
};
