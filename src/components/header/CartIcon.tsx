// components/Header/CartIcon.tsx
import React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";

interface CartIconProps {
  size?: number;
  showCount?: boolean;
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({
  size = 20,
  showCount = true,
  className = "",
}) => {
  const location = useLocation();
  const { status, cart } = useAppSelector((state) => state.cart);
  const cartLoading = status === "loading";
  const cartCount = cart?.summary.totalItems || 0;
  const isActive = location.pathname === "/cart";

  return (
    <div className={`relative ${className}`}>
      <ShoppingCart
        size={size}
        strokeWidth={1.5}
        fill={isActive ? "currentColor" : "none"}
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
};
