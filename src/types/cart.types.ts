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
  mainImage: {
    imageUrl: string;
    altText: string;
  } | null;
  quantity: number;
  stockName: string;
  addedAt: string;
  category: {
    id: string;
    name: string;
    parentCategory: {
      id: string;
      name: string;
    } | null;
  };
  
  // Enhanced stock validation fields
  status: 'available' | 'out_of_stock' | 'quantity_exceeded' | 'low_stock_warning';
  statusCode: 'IN_STOCK' | 'OUT_OF_STOCK' | 'QUANTITY_EXCEEDED' | 'LOW_STOCK';
  message: string;
  action: 'proceed' | 'remove' | 'reduce_quantity' | 'proceed_with_caution';
  canProceedToCheckout: boolean;
  stockInfo: {
    availableStock: number;
    cartQuantity: number;
    maxAllowed?: number;
    isOutOfStock: boolean;
    isLowStock: boolean;
  };
  
  // Legacy fields for backward compatibility
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
  totalValidItems: number;
  totalOriginalPrice: number;
  totalDiscount: number;
  
  // Enhanced cart status fields
  overallStatus: 'ready' | 'requires_action' | 'low_stock_warning';
  canProceedToCheckout: boolean;
  checkoutMessage: string;
  hasOutOfStockItems: boolean;
  hasLowStockWarnings: boolean;
  hasQuantityIssues: boolean;
  itemsRequiringAttention: number;
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