// types/products.ts
export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string | null;
  position?: number | null;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductSize {
  stockName: string;
  stock: number;
}

export interface ProductWithDetails {
  id: string;
  name: string;
  description: string;
  price: number | string;
  fakePrice: number | string;
  images: ProductImage[];
  totalSales: number;
  views: number;
  category?: Category;
  productSizes?: ProductSize[];
}

export interface ProductCardProps {
  product: ProductWithDetails;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
  onProductClick?: (productId: string) => void;
}