import { Heart, X, Lock, User, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
  reason?: "wishlist" | "cart";
}

export default function GuestModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  reason = "wishlist",
}: GuestModalProps) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    console.log("Sign in clicked");
    if (onSignIn) {
      // Use custom handler if provided (for wishlist page)
      onSignIn();
    } else {
      // Default behavior (for product cards)
      navigate("/signin");
      onClose();
    }
  };

  const handleSignUp = () => {
    console.log("Sign up clicked");
    if (onSignUp) {
      // Use custom handler if provided (for wishlist page)
      onSignUp();
    } else {
      // Default behavior (for product cards)
      navigate("/signup");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              {reason === "wishlist" ? (
                <Heart className="w-6 h-6 text-blue-600" />
              ) : (
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {reason === "wishlist" ? "Save to Wishlist" : "Add to Cart"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Sign in Required
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Please sign in to your account to
              {reason === "wishlist"
                ? " save items to your wishlist "
                : " add items to your cart "}
              and access them across all your devices.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              Sign In
            </button>

            <button
              onClick={handleSignUp}
              className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
            >
              Create Account
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors duration-200 text-sm"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
