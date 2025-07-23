import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import type { WishlistItem } from "../types/wishlist.types";
import { wishlistService } from "../services/wishlist.services";
const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await wishlistService.getUserWishlist();
      setWishlist(response.products);
    } catch (err) {
      setError("Failed to fetch wishlist");
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    try {
      setRemovingItem(productId);
      await wishlistService.toggleWishlist(productId);
      setWishlist(wishlist.filter((item) => item.id !== productId));
    } catch (err) {
      setError("Failed to remove item");
      console.error("Remove error:", err);
    } finally {
      setRemovingItem(null);
    }
  };

  const moveToCart = async (item: WishlistItem): Promise<void> => {
    try {
      // TODO: cartService.addToCart(item.id);
      await removeFromWishlist(item.id);
    } catch (err) {
      setError("Failed to add to cart");
      console.error("Cart error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          My Wishlist ({wishlist.length})
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-800">{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-600 hover:text-red-800"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-6">
            <Heart className="mx-auto h-24 w-24 text-gray-300" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-8">
            Save items you like to buy them later
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Wishlist List */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {wishlist.map((item, index) => (
            <div
              key={item.wishlistItemId}
              className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                index !== wishlist.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              {/* Product Image */}
              <Link
                to={`/product/${item.id}`}
                className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 mr-4"
              >
                <img
                  src={`${S3_BASE_URL}${item.mainImage?.imageUrl}` || "/api/placeholder/128/128"}
                  alt={item.mainImage?.altText || item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <Link
                  to={`/product/${item.id}`}
                  className="text-base md:text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{Number(item.price).toFixed(0)}
                  </span>
                  {Number(item.fakePrice) > Number(item.price) && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{Number(item.fakePrice).toFixed(0)}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round(
                          ((item.fakePrice - item.price) / item.fakePrice) * 100
                        )}
                        % off
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-3">
                  {item.inStock ? (
                    <span className="text-sm text-green-600">In Stock</span>
                  ) : (
                    <span className="text-sm text-red-600">Out of Stock</span>
                  )}
                </div>

                {/* Mobile Actions */}
                <div className="mt-3 flex items-center gap-2 md:hidden">
                  <button
                    onClick={() => moveToCart(item)}
                    disabled={!item.inStock}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Desktop Actions and Remove Button */}
              <div className="flex items-center gap-3 ml-4">
                {/* Desktop Add to Cart */}
                <button
                  onClick={() => moveToCart(item)}
                  disabled={!item.inStock}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  disabled={removingItem === item.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="Remove from wishlist"
                >
                  {removingItem === item.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-red-600"></div>
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;