// types/wishlist.types.ts
export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  inStock: boolean;
}

export interface WishlistItem {
  _id: string;
  productId: Product;
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  data: Wishlist;
  error?: string;
}