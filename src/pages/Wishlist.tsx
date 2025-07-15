// pages/Wishlist.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import type{ WishlistResponse ,WishlistItem} from '../types/wishlist.types'; 

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<WishlistResponse>('/api/user/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlist(response.data.data.items);
    } catch (err) {
      setError('Failed to fetch wishlist');
      console.error('Wishlist fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    try {
      setRemovingItem(productId);
      await axios.delete(`/api/user/wishlist/remove/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlist(wishlist.filter(item => item.productId._id !== productId));
    } catch (err) {
      setError('Failed to remove item');
      console.error('Remove error:', err);
    } finally {
      setRemovingItem(null);
    }
  };

  const clearWishlist = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await axios.delete('/api/user/wishlist/clear', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setWishlist([]);
      } catch (err) {
        setError('Failed to clear wishlist');
        console.error('Clear error:', err);
      }
    }
  };

  const moveToCart = async (item: WishlistItem): Promise<void> => {
    try {
      // Add your cart API call here
      console.log('Moving to cart:', item);
      // Example:
      // await axios.post('/api/user/cart/add', { productId: item.productId._id });
      
      // Remove from wishlist after adding to cart
      await removeFromWishlist(item.productId._id);
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Cart error:', err);
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-800">{error}</span>
          <button
            onClick={() => setError('')}
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
        /* Wishlist Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative aspect-w-1 aspect-h-1">
                <img
                  src={item.productId.image || '/api/placeholder/300/300'}
                  alt={item.productId.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.productId._id)}
                  disabled={removingItem === item.productId._id}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                  aria-label="Remove from wishlist"
                >
                  {removingItem === item.productId._id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {item.productId.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    ${item.productId.price.toFixed(2)}
                  </span>
                  {item.productId.inStock ? (
                    <span className="text-sm text-green-600 font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => moveToCart(item)}
                    disabled={!item.productId.inStock}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${item.productId._id}`}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;