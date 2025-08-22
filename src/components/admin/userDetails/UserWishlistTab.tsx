// components/admin/userDetail/UserWishlistTab.tsx
import React from 'react';
import { Heart, DollarSign, Calendar } from 'lucide-react';
import type { WishlistItem } from '../../../types/admin/userDetail.types';

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;
interface UserWishlistTabProps {
  wishlist: WishlistItem[];
  loading: boolean;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export const UserWishlistTab: React.FC<UserWishlistTabProps> = ({ 
  wishlist, 
  loading, 
  formatDate,
  formatCurrency 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No wishlist items found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wishlist.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {item.product.images.length > 0 ? (
            <img 
              src={`${S3_BASE_URL}${item.product.images[0].imageUrl}`} 
              alt={item.product.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-2">{item.product.name}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.product.description}</p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="font-medium text-green-600">
                    {formatCurrency(item.product.discountedPrice)}
                  </span>
                  {item.product.originalPrice !== item.product.discountedPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatCurrency(item.product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Added: {formatDate(item.addedAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};