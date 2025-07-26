// hooks/useCart.ts
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { cartService } from '../services/cart.services';
import type{ CartResponse, CartItem } from '../types/cart.types';

export const useCart = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (
    productId: string,
    stockName: string,
    quantity: number = 1
  ) => {
    try {
      setActionLoading('add');
      const result = await cartService.addToCart(productId, stockName, quantity);
      
      if (result.alreadyInCart) {
        // Update quantity instead
        await cartService.updateQuantity(result.cartItem.id, result.cartItem.quantity + quantity);
        toast.success('Updated quantity');
      } else {
        toast.success('Added to cart');
      }
      
      await fetchCart();
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (
    cartItemId: string,
    quantity: number
  ) => {
    try {
      setActionLoading(cartItemId);
      const data = await cartService.updateQuantity(cartItemId, quantity);
      setCart(data);
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const removeFromCart = useCallback(async (cartItemId: string) => {
    try {
      setActionLoading(cartItemId);
      const data = await cartService.removeFromCart(cartItemId);
      setCart(data);
      toast.success('Removed from cart');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setActionLoading('clear');
      const data = await cartService.clearCart();
      setCart(data);
      toast.success('Cart cleared');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const isInCart = useCallback((productId: string, stockName?: string): boolean => {
    if (!cart) return false;
    
    if (stockName) {
      return cart.items.some(
        item => item.productId === productId && item.stockName === stockName
      );
    }
    
    return cart.items.some(item => item.productId === productId);
  }, [cart]);

  const getCartItem = useCallback((
    productId: string, 
    stockName: string
  ): CartItem | undefined => {
    if (!cart) return undefined;
    return cart.items.find(
      item => item.productId === productId && item.stockName === stockName
    );
  }, [cart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    actionLoading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItem,
  };
};