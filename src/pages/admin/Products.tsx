import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Package,
  AlertCircle,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ProductForm from "../../components/admin/ProductForm";
import type { Product, ProductStock } from "../../types/products.types";
import instance from "../../utils/axios";
const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<"list" | "add" | "edit">(
    "list"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get("/api/product/all");
      const data = response.data;

      // --- ADD THIS LINE FOR DEBUGGING ---
      console.log("API Response Data:", data);
      // Check the first product's category in the browser console
      if (data.products && data.products.length > 0) {
        console.log("Category type is:", typeof data.products[0].category);
        console.log("Category value is:", data.products[0].category);
      }
      // --- END DEBUGGING LINES ---

      if (data && Array.isArray(data)) {
        setProducts(data);
      } else if (data && data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Unexpected data format:", data);
        setError("Unexpected data format received");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch products"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get total stock from productStocks array
  const getTotalStock = (productSizes: ProductStock[]): number => {
    return productSizes.reduce((total, size) => total + size.stock, 0);
  };

  // Calculate filtered products
  const filteredProducts = products.filter((product) => {
    const totalStock = getTotalStock(product.productSizes || []);
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.status === "active") ||
      (statusFilter === "low stock" && totalStock > 0 && totalStock <= 10) ||
      (statusFilter === "out of stock" && totalStock === 0) ||
      (statusFilter === "inactive" && product.status === "inactive");
    return matchesSearch && matchesStatus;
  });

  // Get paginated products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setCurrentView("add");
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView("edit");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId: string | number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setProducts(products.filter((p) => p.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleProductSubmit = async (productData: any) => {
    try {
      if (currentView === "add") {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        await fetchProducts();
      } else if (currentView === "edit" && selectedProduct) {
        const response = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        await fetchProducts();
      }

      handleBackToList();
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  };

  const getProductStatusBadge = (product: Product) => {
    // First check if product is inactive
    if (product.status === "inactive") {
      return { label: "Inactive", variant: "error" as const };
    }

    // For active products, determine stock status
    const totalStock = getTotalStock(product.productSizes || []);
    if (totalStock === 0)
      return { label: "Out of Stock", variant: "error" as const };
    if (totalStock <= 10)
      return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "success" as const };
  };

  // Get main image URL
  const getMainImage = (product: Product): string => {
    // Early return if no images
    if (!product.images || product.images.length === 0) {
      return "/placeholder-product.png";
    }

    // Find the main image or fall back to first image
    const image = product.images.find((img) => img.isMain) || product.images[0];
    if (!image) return "/placeholder-product.png";

    // Construct URL only if we have valid data
    const imageKey = image.imageUrl || image.url;
    if (!imageKey) return "/placeholder-product.png";

    // Return full S3 URL or placeholder
    return imageKey.startsWith("http") ? imageKey : `${S3_BASE_URL}${imageKey}`;
  };

  // Create a memoized version of the image component
  const ProductImage = React.memo(
    ({ imageUrl, alt }: { imageUrl: string; alt: string }) => {
      const [imgSrc, setImgSrc] = useState(imageUrl);

      useEffect(() => {
        setImgSrc(imageUrl);
      }, [imageUrl]);

      return (
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgSrc("/placeholder-product.png")}
          loading="lazy" // Add lazy loading
        />
      );
    }
  );

  // Render Add/Edit Form
  if (currentView === "add" || currentView === "edit") {
    return (
      <ProductForm
        mode={currentView}
        initialData={selectedProduct}
        onSubmit={handleProductSubmit}
        onCancel={handleBackToList}
      />
    );
  }

  // Calculate stats - only count active products for stock status
  const lowStockCount = products.filter(
    (p) =>
      p.status === "active" &&
      getTotalStock(p.productSizes || []) > 0 &&
      getTotalStock(p.productSizes || []) <= 10
  ).length;

  const outOfStockCount = products.filter(
    (p) => p.status === "active" && getTotalStock(p.productSizes || []) === 0
  ).length;

  // Loading state
  if (isLoading && currentView === "list") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && currentView === "list") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error loading products</p>
          <p className="text-slate-600 mt-2">{error}</p>
          <Button
            onClick={fetchProducts}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Render Product List
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Products</h1>
            <p className="text-slate-600 mt-1">Manage your product inventory</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchProducts}
              className="bg-sky-500 hover:bg-slate-200 text-slate-700 px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700"></div>
              ) : (
                "Refresh"
              )}
            </Button>
            <Button
              onClick={handleAddProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-5"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Products</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {products.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {lowStockCount}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {outOfStockCount}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="low stock">Low Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-500">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const totalStock = getTotalStock(product.productSizes || []);
                  const stockStatus = getProductStatusBadge(product);
                  const mainImageUrl = getMainImage(product);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Product Name Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            <ProductImage
                              imageUrl={mainImageUrl}
                              alt={product.name}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {product.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {product.productSizes
                                ?.map((s) => s.stockName)
                                .join(", ") || "No sizes"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700 capitalize">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {product.fakePrice &&
                          product.fakePrice > product.price ? (
                            <>
                              <span className="font-semibold text-slate-800">
                                ${Number(product.price).toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-500 line-through ml-2">
                                ${Number(product.fakePrice).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-slate-800">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span
                            className={`font-semibold ${
                              totalStock === 0
                                ? "text-red-600"
                                : totalStock <= 10
                                ? "text-amber-600"
                                : "text-slate-800"
                            }`}
                          >
                            {totalStock}
                          </span>
                          {product.productSizes &&
                            product.productSizes.length > 0 && (
                              <p className="text-xs text-slate-500 mt-1">
                                {product.productSizes
                                  .map(
                                    (stock) =>
                                      `${stock.stockName}: ${stock.stock}`
                                  )
                                  .join(" | ")}
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              product.id && handleDeleteProduct(product.id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold">{paginatedProducts.length}</span>{" "}
              of{" "}
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of{" "}
                {Math.ceil(filteredProducts.length / itemsPerPage) || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(filteredProducts.length / itemsPerPage),
                      currentPage + 1
                    )
                  )
                }
                disabled={
                  currentPage ===
                    Math.ceil(filteredProducts.length / itemsPerPage) ||
                  filteredProducts.length === 0
                }
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
