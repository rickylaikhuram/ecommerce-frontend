// components/cart/CartButton.tsx
import React, { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

interface CartButtonProps {
  productId: string;
  productName: string;
  selectedSize: string;
  availableStock: number;
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({
  productId,
  selectedSize,
  availableStock,
  className = "",
}) => {
  const navigate = useNavigate();
  const { addToCart, getCartItem, actionLoading } = useCartContext();
  const [localLoading, setLocalLoading] = useState(false);

  const cartItem = getCartItem(productId, selectedSize);
  const quantity = cartItem?.quantity || 0;
  const inCart = quantity > 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    setLocalLoading(true);
    try {
      await addToCart(productId, selectedSize, 1);
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = localLoading || actionLoading === "add";

  if (inCart) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
          <Check className="w-4 h-4" />
          <span className="font-medium">In Cart ({quantity})</span>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Cart
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || availableStock === 0 || !selectedSize}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
        ${
          availableStock === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        }
        ${!selectedSize && "opacity-50 cursor-not-allowed"}
        ${isLoading && "opacity-75 cursor-wait"}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {availableStock === 0 ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </button>
  );
};
