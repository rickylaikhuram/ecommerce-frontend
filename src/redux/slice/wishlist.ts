import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import { wishlistService } from "../../services/wishlist.services";
import type { WishlistIdsResponse, WishlistItem, WishlistResponse } from "../../types/wishlist.types";

// Async thunks
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId: string) => {
    const response = await wishlistService.toggleWishlist(productId);
    return { productId, removed: response.removed };
  }
);

export const fetchWishlistedIds = createAsyncThunk(
  "wishlist/fetchIds",
  async () => {
    return await wishlistService.getUserWishlistedIds();
  }
);

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchProducts",
  async () => {
    return await wishlistService.getUserWishlist();
  }
);

// Types
interface WishlistState {
  wishlistedIds: string[];
  products: WishlistItem[]; 
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlistedIds: [],
  products: [],
  loading: false,
  error: null,
};

// Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.wishlistedIds = [];
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle wishlist
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, removed } = action.payload;
        
        if (removed) {
          // Remove from wishlistedIds
          state.wishlistedIds = state.wishlistedIds.filter(id => id !== productId);
          // Remove from products array
          state.products = state.products.filter(product => product.id !== productId);
        } else {
          // Add to wishlistedIds if not already present
          if (!state.wishlistedIds.includes(productId)) {
            state.wishlistedIds.push(productId);
          }
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to toggle wishlist";
      })
      
      // Fetch wishlist IDs
      .addCase(fetchWishlistedIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistedIds.fulfilled, (state, action: PayloadAction<WishlistIdsResponse>) => {
        state.loading = false;
        state.wishlistedIds = action.payload.wishlistedIds;
      })
      .addCase(fetchWishlistedIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch wishlist IDs";
      })
      
      // Fetch full wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        // Also update wishlistedIds from the products
        state.wishlistedIds = action.payload.products.map(product => product.id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch wishlist";
      });
  },
});

// Actions
export const { clearError, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistedIds = (state: { wishlist: WishlistState }) => state.wishlist.wishlistedIds;
export const selectWishlistProducts = (state: { wishlist: WishlistState }) => state.wishlist.products;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.loading;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;
export const selectIsProductWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlistedIds.includes(productId);

export default wishlistSlice.reducer;