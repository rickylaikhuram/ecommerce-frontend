// types/checkout.types.ts

import type { Address } from "./user.types";

export interface CheckoutItem {
  productId: string;
  productVarient: string;
  quantity: number;
}

// Checkout props
export interface CheckoutState {
  items: CheckoutItem[];
}

// Image interface
export interface Image {
  imageUrl: string;
  altText: string;
}

// Product details in checkout response
export interface ProductDetails {
  id: string;
  name: string;
  discountedPrice: string;
  originalPrice: string;
  mainImage: Image | null;
}

// Cart item details
export interface CartDetails {
  cartItemId: string;
  stockName: string;
  quantity: number;
  itemTotal: number;
}

// Stock information
export interface StockInfo {
  availableStock: number;
  cartQuantity: number;
  maxAllowed?: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

// Individual product response from checkout validation
export interface ProductResponse {
  productId: string;
  status: 
    | "available"
    | "low_stock_warning"
    | "out_of_stock"
    | "quantity_exceeded"
    | "error";
  statusCode:
    | "IN_STOCK"
    | "LOW_STOCK"
    | "OUT_OF_STOCK"
    | "QUANTITY_EXCEEDED"
    | "PRODUCT_NOT_FOUND"
    | "VARIANT_NOT_FOUND"
    | "ITEM_NOT_IN_CART";
  message: string;
  action: 
    | "proceed"
    | "proceed_with_caution"
    | "remove"
    | "reduce_quantity";
  canProceedToCheckout: boolean;
  stockInfo?: StockInfo; // Keep optional as it's not always provided
  productDetails: ProductDetails;
  cartDetails: CartDetails; 
}

// Cart summary for checkout
export interface CartSummary {
  totalValidItems: number;
  totalPrice: number;
  itemsRequiringAttention: number;
  hasOutOfStockItems: boolean;
  hasLowStockWarnings: boolean;
  hasQuantityIssues: boolean;
}

// Recommendations for user actions
export interface CartRecommendations {
  outOfStockCount: number;
  quantityIssuesCount: number;
  lowStockCount: number;
  actionRequired: boolean;
}

// Complete checkout validation response (matches your backend controller)
export interface CartCheckoutResponse {
  success: boolean;
  overallStatus: "ready" | "low_stock_warning" | "requires_action";
  canProceedToCheckout: boolean;
  checkoutMessage: string;
  cartSummary: CartSummary;
  products: ProductResponse[];
  recommendations: CartRecommendations;
}

// For backward compatibility (if you have other places using this)
export interface CartResponse {
  success: true;
  overallStatus: "ready" | "low_stock_warning" | "requires_action";
  canProceedToCheckout: boolean;
  checkoutMessage: string;
  cartSummary: CartSummary;
  products: ProductResponse[];
  recommendations: CartRecommendations;
}

// Additional types for checkout flow
export interface CheckoutFormData {
  shippingAddress: string;
  paymentMethod: string;
  specialInstructions?: string;
}

export interface CheckoutError {
  field?: string;
  message: string;
  code?: string;
}

// Order placement types
export interface OrderItem {
  productId: string;
  productVarient: string;
  quantity: number;
  price: number;
  itemTotal: number;
}


export interface OrderResponse {
  success: boolean;
  orderId: string;
  amount: string;
  paymentUrl: string;
}