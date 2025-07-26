// product image
export interface ProductImage {
  id?: string | number; // Optional for existing images
  imageUrl: string; // S3 key
  altText: string;
  position: number;
  isMain: boolean;
  url?: string; // Optional - for displaying existing images
}

// product stock
export interface ProductStock {
  id?: string | number; // Optional for existing stocks
  stockName: string; // Size code (S, M, L, etc.)
  stock: number;
  sizeName?: string; // Optional - full size name (Small, Medium, Large)
}

// product category
export interface Category {
  id?: string;
  name: string;
}

// product details
export interface Product {
  id?: string ; // Optional for new products
  name: string;
  description: string;
  originalPrice: number; // Original price
  discountedPrice: number; // Discounted price
  category: Category; // Category ID or name
  isActive: Boolean
  images: ProductImage[];
  productSizes: ProductStock[];
  totalSales: number;
  views: number;
  createdAt?: Date | string;
}

// product filter types -- uesd in product service
export interface ProductFilters {
  category?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'popular';
  limit?: number;
  offset?: number;
  filter?: 'bestsellers' | 'trending';
  period?: 'week' | 'month' | 'year' | 'alltime';
  search?: string;
}

// product filter type response -- uesd in product service
export interface ProductResponse {
  message: string;
  products: Product[];
  pagination: {
    total: number;
    limit: number | null;
    offset: number;
    hasMore: boolean;
  };
  searchTerm?: string;
}

// product card props
export interface ProductCardProps {
  product: Product;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
  onProductClick?: (productId: string) => void;
}

// used this to create product form data
export interface FormData {
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  sizes: {sizeCode: string; stock: number }[];
  images: File[];
  isActive: boolean;
}

export interface UploadStatus {
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

// Props for the ProductForm component
export interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: Product | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}
