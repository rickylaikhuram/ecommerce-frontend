// Individual wishlist item response
export interface WishlistItem {
  id: string;                    // Product ID for navigation
  name: string;                  // Product name
  price: number;                 // Original price
  fakePrice: number;            // Discounted price
  mainImage: {                  // Main product image
    imageUrl: string;           // S3 key
    altText: string;            // Alt text for accessibility
  } | null;                     // Can be null if no main image exists
  inStock: boolean;             // Stock availability status
  wishlistItemId: string;       // Wishlist item ID for removal
}

// Wishlist response
export interface WishlistResponse {
  products: WishlistItem[];
}

export interface WishlistIdsResponse {
  wishlistedIds: string[];
}
