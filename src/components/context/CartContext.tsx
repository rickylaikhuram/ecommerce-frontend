import { createContext, useContext, useState, type ReactNode } from 'react';

// Item type
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Context shape
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const incrementQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  };

  const decrementQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
