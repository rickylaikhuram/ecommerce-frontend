// types/cart.types.ts
export interface CartImage {
  imageUrl: string;
  altText: string | null;
}

export interface CartCategory {
  id: string;
  name: string;
  parentCategory: {
    id: string;
    name: string;
  } | null;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  mainImage: CartImage | null;
  quantity: number;
  stockName: string;
  addedAt: Date;
  category: CartCategory;
  inStock: boolean;
  stockVariantInStock: boolean;
  availableStock: number;
  subtotal: number;
  originalSubtotal: number;
  discount: number;
}

export interface CartSummary {
  totalItems: number;
  totalUniqueItems: number;
  totalPrice: number;
  totalOriginalPrice: number;
  totalDiscount: number;
}

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}

export interface AddToCartResponse {
  success: boolean;
  alreadyInCart: boolean;
  cartItem: {
    id: string;
    quantity: number;
  };
  message: string;
}