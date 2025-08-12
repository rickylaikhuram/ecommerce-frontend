// context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import instance from '../utils/axios';
import type { CartResponse, CartItem } from '../types/cart.types';

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
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Helper function to get empty cart summary
  const getEmptySummary = () => ({
    totalItems: 0,
    totalUniqueItems: 0,
    totalPrice: 0,
    totalValidItems: 0,
    totalOriginalPrice: 0,
    totalDiscount: 0,
    overallStatus: 'ready' as const,
    canProceedToCheckout: true,
    checkoutMessage: 'Your cart is empty',
    hasOutOfStockItems: false,
    hasLowStockWarnings: false,
    hasQuantityIssues: false,
    itemsRequiringAttention: 0,
  });

  // Fetch cart from server
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await instance.get('api/user/cart');
      setCart(response.data);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      // If it's a 404 or other error, set empty cart
      if (error.response?.status === 404 || error.response?.status === 401) {
        setCart({ items: [], summary: getEmptySummary() });
      } else {
        setCart({ items: [], summary: getEmptySummary() });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimistic update helper for quantity changes
  const updateQuantityOptimistic = (itemId: string, newQuantity: number) => {
    setCart(prevCart => {
      if (!prevCart || newQuantity < 0) return prevCart;
      
      const updatedItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, quantity: newQuantity };
          
          // Recalculate price values
          updatedItem.subtotal = newQuantity * item.discountedPrice;
          updatedItem.originalSubtotal = newQuantity * item.originalPrice;
          updatedItem.discount = updatedItem.originalSubtotal - updatedItem.subtotal;
          
          // Update stock status based on new quantity
          const availableStock = updatedItem.stockInfo?.availableStock || updatedItem.availableStock;
          
          if (newQuantity === 0) {
            // Item will be removed
            return null;
          } else if (newQuantity <= availableStock) {
            updatedItem.status = availableStock < 10 ? 'low_stock_warning' : 'available';
            updatedItem.statusCode = availableStock < 10 ? 'LOW_STOCK' : 'IN_STOCK';
            updatedItem.canProceedToCheckout = true;
            updatedItem.message = availableStock < 10 
              ? `Only ${availableStock} items left in stock!` 
              : 'Item is available.';
            updatedItem.action = availableStock < 10 ? 'proceed_with_caution' : 'proceed';
          } else {
            updatedItem.status = 'quantity_exceeded';
            updatedItem.statusCode = 'QUANTITY_EXCEEDED';
            updatedItem.canProceedToCheckout = false;
            updatedItem.message = `Only ${availableStock} items available`;
            updatedItem.action = 'reduce_quantity';
          }
          
          return updatedItem;
        }
        return item;
      }).filter(Boolean) as CartItem[];

      // Recalculate summary
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalOriginalPrice = updatedItems.reduce((sum, item) => sum + item.originalSubtotal, 0);
      const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
      
      const canProceedToCheckout = updatedItems.length > 0 && updatedItems.every(item => item.canProceedToCheckout);
      const hasQuantityIssues = updatedItems.some(item => item.statusCode === 'QUANTITY_EXCEEDED');
      const hasOutOfStockItems = updatedItems.some(item => item.statusCode === 'OUT_OF_STOCK');
      const hasLowStockWarnings = updatedItems.some(item => item.statusCode === 'LOW_STOCK');
      
      let overallStatus: 'ready' | 'requires_action' | 'low_stock_warning' = 'ready';
      let checkoutMessage = 'Your cart is ready for checkout.';
      
      if (hasOutOfStockItems || hasQuantityIssues) {
        overallStatus = 'requires_action';
        checkoutMessage = 'Some items require attention before checkout.';
      } else if (hasLowStockWarnings) {
        overallStatus = 'low_stock_warning';
        checkoutMessage = 'Some items have limited stock. Complete your purchase soon!';
      }

      const newSummary = {
        totalItems,
        totalUniqueItems: updatedItems.length,
        totalPrice,
        totalValidItems: totalItems,
        totalOriginalPrice,
        totalDiscount,
        overallStatus,
        canProceedToCheckout,
        checkoutMessage,
        hasOutOfStockItems,
        hasLowStockWarnings,
        hasQuantityIssues,
        itemsRequiringAttention: updatedItems.filter(item => !item.canProceedToCheckout).length,
      };

      return { items: updatedItems, summary: newSummary };
    });
  };

  // Handle stock conflicts when backend returns errors
  const handleStockConflict = (itemId: string, errorData: any) => {
    const { availableStock, action, message, productInfo } = errorData;
    
    setCart(prevCart => {
      if (!prevCart) return prevCart;
      
      const updatedItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          if (action === 'remove' || availableStock === 0) {
            return {
              ...item,
              status: 'out_of_stock' as const,
              statusCode: 'OUT_OF_STOCK' as const,
              message: 'This item is now out of stock',
              canProceedToCheckout: false,
              action: 'remove' as const,
              subtotal: 0,
              stockInfo: {
                ...item.stockInfo,
                availableStock: 0,
                isOutOfStock: true,
                isLowStock: false,
              }
            };
          } else if (action === 'reduce_quantity') {
            const adjustedQuantity = Math.min(item.quantity, availableStock);
            return {
              ...item,
              quantity: adjustedQuantity,
              subtotal: adjustedQuantity * item.discountedPrice,
              originalSubtotal: adjustedQuantity * item.originalPrice,
              discount: (adjustedQuantity * item.originalPrice) - (adjustedQuantity * item.discountedPrice),
              status: 'quantity_exceeded' as const,
              statusCode: 'QUANTITY_EXCEEDED' as const,
              message: `Stock changed! Only ${availableStock} available`,
              canProceedToCheckout: false,
              action: 'reduce_quantity' as const,
              stockInfo: {
                ...item.stockInfo,
                availableStock,
                maxAllowed: availableStock,
                isOutOfStock: false,
                isLowStock: availableStock < 10,
              }
            };
          }
        }
        return item;
      });

      // Recalculate summary for updated items
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const canProceedToCheckout = updatedItems.every(item => item.canProceedToCheckout);

      const newSummary = {
        ...prevCart.summary,
        totalItems,
        totalPrice,
        canProceedToCheckout,
        overallStatus: 'requires_action' as const,
        hasQuantityIssues: true,
        itemsRequiringAttention: updatedItems.filter(item => !item.canProceedToCheckout).length,
      };

      return { items: updatedItems, summary: newSummary };
    });

    // Show user notification
    const productName = productInfo?.name || 'Item';
    if (action === 'remove') {
      alert(`${productName} is now out of stock and needs to be removed from your cart.`);
    } else {
      alert(`Stock updated for ${productName}! ${message}`);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, stockName: string, quantity: number = 1) => {
    setActionLoading('add');
    try {
      const response = await instance.post('api/user/cart/add', {
        productId,
        stockName,
        quantity
      });

      // Refresh cart to get updated data
      await fetchCart();
      return response.data;
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      throw new Error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity === 0) {
      return removeFromCart(itemId);
    }

    // 1. Optimistic update first
    updateQuantityOptimistic(itemId, quantity);
    
    // 2. Send to backend
    setActionLoading(itemId);
    try {
      const response = await instance.patch(`api/user/cart/items/${itemId}/quantity`, {
        quantity
      });

      // Success - update with fresh data from server
      setCart(response.data);
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      
      const errorData = error.response?.data;
      
      if (errorData) {
        // Handle different error types
        switch (errorData.error) {
          case 'OUT_OF_STOCK':
            handleStockConflict(itemId, errorData);
            // Auto-remove out of stock items after showing message
            setTimeout(() => removeFromCart(itemId), 3000);
            break;
            
          case 'INSUFFICIENT_STOCK':
            handleStockConflict(itemId, errorData);
            break;
            
          case 'PRODUCT_UNAVAILABLE':
            alert('This product is no longer available and will be removed from your cart.');
            await removeFromCart(itemId);
            break;
            
          default:
            // Revert optimistic update for other errors
            await fetchCart();
            alert(errorData.message || 'Failed to update quantity');
        }
      } else {
        // Network error or other issue - revert optimistic update
        await fetchCart();
        alert('Failed to update quantity. Please try again.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    // Optimistic removal
    setCart(prevCart => {
      if (!prevCart) return prevCart;
      
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      
      // Recalculate summary
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalOriginalPrice = updatedItems.reduce((sum, item) => sum + item.originalSubtotal, 0);
      const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
      
      const newSummary = updatedItems.length > 0 ? {
        ...prevCart.summary,
        totalItems,
        totalUniqueItems: updatedItems.length,
        totalPrice,
        totalValidItems: totalItems,
        totalOriginalPrice,
        totalDiscount,
        canProceedToCheckout: updatedItems.every(item => item.canProceedToCheckout),
        hasQuantityIssues: updatedItems.some(item => item.statusCode === 'QUANTITY_EXCEEDED'),
        hasOutOfStockItems: updatedItems.some(item => item.statusCode === 'OUT_OF_STOCK'),
        hasLowStockWarnings: updatedItems.some(item => item.statusCode === 'LOW_STOCK'),
        itemsRequiringAttention: updatedItems.filter(item => !item.canProceedToCheckout).length,
      } : getEmptySummary();

      return { items: updatedItems, summary: newSummary };
    });

    setActionLoading(itemId);
    try {
      await instance.delete(`api/user/cart/items/${itemId}`);
    } catch (error: any) {
      console.error('Failed to remove item:', error);
      // Revert optimistic removal
      await fetchCart();
      const errorMessage = error.response?.data?.message || 'Failed to remove item';
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setActionLoading('clear');
    try {
      await instance.delete('api/user/cart/clear');
      setCart({ items: [], summary: getEmptySummary() });
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Check if item is in cart
  const isInCart = (productId: string, stockName?: string) => {
    if (!cart) return false;
    
    return cart.items.some(item => {
      if (stockName) {
        return item.productId === productId && item.stockName === stockName;
      }
      return item.productId === productId;
    });
  };

  // Get specific cart item
  const getCartItem = (productId: string, stockName: string): CartItem | undefined => {
    if (!cart) return undefined;
    
    return cart.items.find(item => 
      item.productId === productId && item.stockName === stockName
    );
  };

  // Initialize cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const contextValue: CartContextType = {
    cart,
    loading,
    actionLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={contextValue}>
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