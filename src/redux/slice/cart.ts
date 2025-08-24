import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import instance from "../../utils/axios";

// Import types from your existing types file
import type {
  CartResponse,
  CartItem,
  CartSummary,
} from "../../types/cart.types";

interface CartState {
  cart: CartResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionLoading: string | null; // track specific item actions
  error: string | null;
}

const getEmptySummary = (): CartSummary => ({
  totalItems: 0,
  totalUniqueItems: 0,
  totalPrice: 0,
  totalValidItems: 0,
  totalOriginalPrice: 0,
  totalDiscount: 0,
  overallStatus: "ready",
  canProceedToCheckout: true,
  checkoutMessage: "Your cart is empty",
  hasOutOfStockItems: false,
  hasLowStockWarnings: false,
  hasQuantityIssues: false,
  itemsRequiringAttention: 0,
});

const initialState: CartState = {
  cart: null,
  status: "idle",
  actionLoading: null,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("api/user/cart");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        return { items: [], summary: getEmptySummary() };
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      productId,
      stockName,
      quantity = 1,
    }: { productId: string; stockName: string; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post("api/user/cart/add", {
        productId,
        stockName,
        quantity,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.patch(
        `api/user/cart/items/${itemId}/quantity`,
        {
          quantity,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update quantity",
        errorData: error.response?.data,
        itemId,
      });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId: string, { rejectWithValue }) => {
    try {
      await instance.delete(`api/user/cart/items/${itemId}`);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await instance.delete("api/user/cart/clear");
      return;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Optimistic update for quantity changes
    updateQuantityOptimistic: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      if (!state.cart) return;

      const { itemId, quantity } = action.payload;

      if (quantity < 0) return;

      const updatedItems = state.cart.items
        .map((item) => {
          if (item.id === itemId) {
            if (quantity === 0) {
              return null; // Will be filtered out
            }

            const updatedItem = { ...item, quantity };

            // Recalculate price values
            updatedItem.subtotal = quantity * item.discountedPrice;
            updatedItem.originalSubtotal = quantity * item.originalPrice;
            updatedItem.discount =
              updatedItem.originalSubtotal - updatedItem.subtotal;

            // Update stock status based on new quantity
            const availableStock = updatedItem.stockInfo.availableStock;

            if (quantity <= availableStock) {
              updatedItem.status =
                availableStock < 10 ? "low_stock_warning" : "available";
              updatedItem.statusCode =
                availableStock < 10 ? "LOW_STOCK" : "IN_STOCK";
              updatedItem.canProceedToCheckout = true;
              updatedItem.message =
                availableStock < 10
                  ? `Only ${availableStock} item${
                      availableStock === 1 ? "" : "s"
                    } left in stock!`
                  : "Item is available.";
              updatedItem.action =
                availableStock < 10 ? "proceed_with_caution" : "proceed";
            } else {
              updatedItem.status = "quantity_exceeded";
              updatedItem.statusCode = "QUANTITY_EXCEEDED";
              updatedItem.canProceedToCheckout = false;
              updatedItem.message = `Only ${availableStock} item${
                availableStock === 1 ? "" : "s"
              } available. Please reduce quantity to ${availableStock}.`;
              updatedItem.action = "reduce_quantity";
            }

            // Update stockInfo
            updatedItem.stockInfo = {
              ...updatedItem.stockInfo,
              cartQuantity: quantity,
              maxAllowed: Math.min(quantity, availableStock),
              isOutOfStock: availableStock === 0,
              isLowStock: availableStock < 10 && availableStock > 0,
            };

            return updatedItem;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      // Recalculate summary
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const totalOriginalPrice = updatedItems.reduce(
        (sum, item) => sum + item.originalSubtotal,
        0
      );
      const totalDiscount = updatedItems.reduce(
        (sum, item) => sum + item.discount,
        0
      );

      const canProceedToCheckout =
        updatedItems.length > 0 &&
        updatedItems.every((item) => item.canProceedToCheckout);
      const hasQuantityIssues = updatedItems.some(
        (item) => item.statusCode === "QUANTITY_EXCEEDED"
      );
      const hasOutOfStockItems = updatedItems.some(
        (item) => item.statusCode === "OUT_OF_STOCK"
      );
      const hasLowStockWarnings = updatedItems.some(
        (item) => item.statusCode === "LOW_STOCK"
      );

      let overallStatus: "ready" | "requires_action" | "low_stock_warning" =
        "ready";
      let checkoutMessage = "Your cart is ready for checkout.";

      if (hasOutOfStockItems || hasQuantityIssues) {
        overallStatus = "requires_action";
        checkoutMessage = "Some items require attention before checkout.";
      } else if (hasLowStockWarnings) {
        overallStatus = "low_stock_warning";
        checkoutMessage =
          "Some items have limited stock. Complete your purchase soon!";
      }

      const newSummary: CartSummary = {
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
        itemsRequiringAttention: updatedItems.filter(
          (item) => !item.canProceedToCheckout
        ).length,
      };

      state.cart = { items: updatedItems, summary: newSummary };
    },

    // Optimistic removal
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;

      const itemId = action.payload;
      const updatedItems = state.cart.items.filter(
        (item) => item.id !== itemId
      );

      // Recalculate summary
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const totalOriginalPrice = updatedItems.reduce(
        (sum, item) => sum + item.originalSubtotal,
        0
      );
      const totalDiscount = updatedItems.reduce(
        (sum, item) => sum + item.discount,
        0
      );

      const newSummary =
        updatedItems.length > 0
          ? {
              ...state.cart.summary,
              totalItems,
              totalUniqueItems: updatedItems.length,
              totalPrice,
              totalValidItems: totalItems,
              totalOriginalPrice,
              totalDiscount,
              canProceedToCheckout: updatedItems.every(
                (item) => item.canProceedToCheckout
              ),
              hasQuantityIssues: updatedItems.some(
                (item) => item.statusCode === "QUANTITY_EXCEEDED"
              ),
              hasOutOfStockItems: updatedItems.some(
                (item) => item.statusCode === "OUT_OF_STOCK"
              ),
              hasLowStockWarnings: updatedItems.some(
                (item) => item.statusCode === "LOW_STOCK"
              ),
              itemsRequiringAttention: updatedItems.filter(
                (item) => !item.canProceedToCheckout
              ).length,
            }
          : getEmptySummary();

      state.cart = { items: updatedItems, summary: newSummary };
    },

    setActionLoading: (state, action: PayloadAction<string | null>) => {
      state.actionLoading = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.actionLoading = "add";
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.actionLoading = null;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
      });

    // Update Quantity
    builder
      .addCase(updateQuantity.pending, (state, action) => {
        state.actionLoading = action.meta.arg.itemId;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.cart = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.actionLoading = null;
        state.error =
          (action.payload as any)?.message || "Failed to update quantity";
        // You might want to handle stock conflicts here similar to your context
      });

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.actionLoading = null;
        // Item already removed optimistically
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
        // Revert optimistic update by refetching cart
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.actionLoading = "clear";
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.actionLoading = null;
        state.cart = { items: [], summary: getEmptySummary() };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateQuantityOptimistic,
  removeItemOptimistic,
  setActionLoading,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCart = (state: any) => state.cart.cart;
export const selectCartStatus = (state: any) => state.cart.status;
export const selectCartError = (state: any) => state.cart.error;
export const selectActionLoading = (state: any) => state.cart.actionLoading;

// Helper selectors
export const selectIsInCart =
  (productId: string, stockName?: string) => (state: any) => {
    if (!state.cart.cart) return false;
    return state.cart.cart.items.some((item: CartItem) => {
      if (stockName) {
        return item.productId === productId && item.stockName === stockName;
      }
      return item.productId === productId;
    });
  };

export const selectCartItem =
  (productId: string, stockName: string) => (state: any) => {
    if (!state.cart.cart) return undefined;
    return state.cart.cart.items.find(
      (item: CartItem) =>
        item.productId === productId && item.stockName === stockName
    );
  };
