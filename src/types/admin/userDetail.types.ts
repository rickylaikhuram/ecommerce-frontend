// types/admin/userDetail.types.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orders?: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    orderItems: number;
  };
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    discountedPrice: number;
    originalPrice: number;
    isActive: boolean;
    images: {
      imageUrl: string;
    }[];
  };
}

export interface CartItem {
  id: string;
  productId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    discountedPrice: number;
    originalPrice: number;
    isActive: boolean;
    images: {
      imageUrl: string;
    }[];
  };
}

export type UserDetailTab = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'cart';

export interface UserDetailTabConfig {
  key: UserDetailTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}