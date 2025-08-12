// types/wishlist.types.ts
export interface WishlistItem {
  id: string;
  name: string;
  originalPrice: string;
  discountedPrice: string;
  mainImage: {
    imageUrl: string;
    altText: string;
  } | null;
  inStock: boolean;
  wishlistItemId: string;
}

export interface WishlistResponse {
  products: WishlistItem[];
}

export interface WishlistIdsResponse {
  productIds: string[];
}