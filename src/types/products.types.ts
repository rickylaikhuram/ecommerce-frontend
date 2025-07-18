export interface ProductImage {
  id?: string | number; // Optional for existing images
  imageUrl: string; // S3 key
  altText: string;
  position: number;
  isMain: boolean;
  url?: string; // Optional - for displaying existing images
}

export interface ProductStock {
  id?: string | number; // Optional for existing stocks
  stockName: string; // Size code (S, M, L, etc.)
  stock: number;
  sizeName?: string; // Optional - full size name (Small, Medium, Large)
}

export interface Product {
  id?: string | number; // Optional for new products
  name: string;
  description: string;
  price: number; // Original price
  fakePrice?: number; // Discounted price
  category: Category; // Category ID or name
  images: ProductImage[];
  productSizes: ProductStock[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  status?: "active" | "inactive" | "draft";
}

export interface Category {
  id?: string;
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
// used this to create product form data
export interface FormData {
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  sizes: { sizeName: string; sizeCode: string; stock: number }[];
  images: File[];
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
