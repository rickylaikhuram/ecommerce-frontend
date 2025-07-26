// context/CartContext.tsx
import React, { createContext, useContext } from 'react';
import { useCart } from '../hooks/useCart';
import type{ CartResponse, CartItem } from '../types/cart.types';

interface CartContextType {
  cart: CartResponse | null;
  loading: boolean;
  actionLoading: string | null;
  addToCart: (productId: string, stockName: string, quantity?: number) => Promise<any>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<any>;
  removeFromCart: (cartItemId: string) => Promise<any>;
  clearCart: () => Promise<any>;
  refreshCart: () => Promise<void>;
  isInCart: (productId: string, stockName?: string) => boolean;
  getCartItem: (productId: string, stockName: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cart = useCart();

  return (
    <CartContext.Provider value={{
      ...cart,
      refreshCart: cart.fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};