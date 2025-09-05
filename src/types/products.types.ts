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
  id: string;
  name: string;
  parentId?: string;
  children: Children[];
}

export interface Children {
  id: string;
  name: string;
  parentId: string;
  imageUrl: string;
  altText: string;
  children: [];
}

export interface CategoryResponse {
  categories: Category[];
}

// product details
export interface Product {
  id?: string; // Optional for new products
  name: string;
  description: string;
  originalPrice: number; // Original price
  discountedPrice: number; // Discounted price
  category: Category; // Category ID or name
  isActive: Boolean;
  images: ProductImage[];
  productSizes: ProductStock[];
  totalSales: number;
  views: number;
  createdAt?: Date | string;
}

// UPDATED: product filter types -- used in product service
export interface ProductFilters {
  category?: string;
  sortBy?:
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc"
    | "newest"
    | "popular";
  limit?: number;
  page?: number; // CHANGED: from offset to page
  filter?: "bestsellers" | "trending";
  period?: "week" | "month" | "year" | "alltime";
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  status?: "active" | "inactive" | "all"; // Added for admin filtering
}

// UPDATED: New pagination interface to match backend response
export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  hasMore: boolean;
  hasPrevious: boolean;
  startItem: number;
  endItem: number;
}

// UPDATED: product filter type response -- used in product service
export interface ProductResponse {
  success: boolean; // Added success field
  message: string;
  products: Product[];
  pagination: PaginationResponse; // CHANGED: Updated pagination structure
  searchTerm?: string;
  statusFilter?: string; // Added for admin
  sizesFilter?: string[]; // Added for size filtering
  userRole?: string; // Added for role-based responses
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
  sizes: { sizeCode: string; stock: number }[];
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

// ADDED: Additional interfaces for enhanced pagination functionality

// View mode type
export type ViewMode = "grid" | "list";

// Pagination component props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  hasMore?: boolean;
  hasPrevious?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  startItem?: number;
  endItem?: number;
  showInfo?: boolean; // Whether to show pagination info
  maxVisiblePages?: number; // Maximum number of page buttons to show
}

// Filter sidebar props
export interface FilterSidebarProps {
  categories: Category[];
  availableSizes: string[];
  selectedCategory: string;
  selectedSizes: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  onCategoryChange: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onPriceChange?: (range: { min: number; max: number }) => void;
  onClearFilters: () => void;
  onApplyFilters?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

// Products header props
export interface ProductsHeaderProps {
  searchTerm: string;
  sortBy: ProductFilters["sortBy"];
  viewMode: ViewMode;
  totalProducts: number;
  onSearchChange?: (value: string) => void;
  onSortChange: (sortBy: ProductFilters["sortBy"]) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
}

// Active filters props
export interface ActiveFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedSizes: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  onRemoveSearch: () => void;
  onRemoveCategory: () => void;
  onRemoveSize: (size: string) => void;
  onRemovePriceRange?: () => void;
  onClearAll: () => void;
}

// Products grid props
export interface ProductsGridProps {
  products: Product[];
  viewMode: ViewMode;
  loading: boolean;
  onProductClick: (productId: string) => void;
  onClearFilters?: () => void;
  emptyStateMessage?: string;
  loadingSkeletonCount?: number;
}

// Sort option interface for UI
export interface SortOption {
  value: ProductFilters["sortBy"];
  label: string;
}

// Filter options for UI components
export interface FilterOptions {
  categories: Category[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
