// hooks/admin/useUserDetail.ts
import { useState, useCallback } from 'react';
import instance from '../../utils/axios';
import type { 
  UserProfile, 
  UserOrder, 
  UserAddress, 
  WishlistItem, 
  CartItem,
  UserDetailTab 
} from '../../types/admin/userDetail.types';

interface UseUserDetailReturn {
  profile: UserProfile | null;
  orders: UserOrder[];
  addresses: UserAddress[];
  wishlist: WishlistItem[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  fetchUserData: (userId: string, tab: UserDetailTab) => Promise<void>;
}

export const useUserDetail = (): UseUserDetailReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async (userId: string, tab: UserDetailTab) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      switch (tab) {
        case 'profile':
          endpoint = `/admin/users/${userId}`;
          break;
        case 'orders':
          endpoint = `/admin/users-order/${userId}`;
          break;
        case 'addresses':
          endpoint = `/admin/users-address/${userId}`;
          break;
        case 'wishlist':
          endpoint = `/admin/users-wishlist/${userId}`;
          break;
        case 'cart':
          endpoint = `/admin/users-cart/${userId}`;
          break;
      }

      const response = await instance.get(endpoint);
      const data = response.data;

      switch (tab) {
        case 'profile':
          setProfile(data.users);
          break;
        case 'orders':
          setOrders(data.order || []);
          break;
        case 'addresses':
          setAddresses(data.address || []);
          break;
        case 'wishlist':
          setWishlist(data.wishlist || []);
          break;
        case 'cart':
          setCart(data.cart || []);
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to fetch ${tab} data`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    orders,
    addresses,
    wishlist,
    cart,
    loading,
    error,
    fetchUserData
  };
};