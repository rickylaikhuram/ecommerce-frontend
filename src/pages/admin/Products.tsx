// Products.tsx
import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AdminProductCard from "../../components/admin/ProductCard";
import ProductForm from "../../components/admin/ProductForm";
import { mockProducts } from "../../data/mockData";
import type { Product } from "../../types/temp.types";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | "add">("view");

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Accessories",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (
    type: "view" | "edit" | "add",
    product?: Product
  ) => {
    setModalType(type);
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId
          ? {
              ...p,
              status:
                p.status === "active"
                  ? "inactive"
                  : ("active" as "active" | "inactive"),
            }
          : p
      )
    );
  };

  const handleProductSubmit = async (productData: any) => {
    try {
      if (modalType === "add") {
        // Create new product
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productData.name,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          sku: productData.sku,
          status: productData.status,
          description: productData.description,
          image: productData.images[0] || '',
          fakePrice: productData.fakePrice,
          weight: productData.weight
        };
        
        setProducts([...products, newProduct]);
        
        // In real app, make API call here
        // await createProduct(productData);
      } else if (modalType === "edit" && selectedProduct) {
        // Update existing product
        const updatedProduct: Product = {
          ...selectedProduct,
          name: productData.name,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          sku: productData.sku,
          status: productData.status,
          description: productData.description,
          image: productData.images[0] || selectedProduct.image,
          fakePrice: productData.fakePrice,
          weight: productData.weight
        };
        
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? updatedProduct : p
        ));
        
        // In real app, make API call here
        // await updateProduct(selectedProduct.id, productData);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button onClick={() => handleOpenModal("add")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <AdminProductCard
            key={product.id}
            product={product}
            onEdit={(product) => handleOpenModal("edit", product)}
            onView={(product) => handleOpenModal("view", product)}
            onDelete={handleDeleteProduct}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalType === "add"
            ? "Add New Product"
            : modalType === "edit"
            ? "Edit Product"
            : "Product Details"
        }
        size={modalType === "view" ? "lg" : "xl"}
      >
        {modalType === "view" && selectedProduct && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-600">{selectedProduct.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Price</span>
                    <p className="text-lg font-semibold">
                      ${selectedProduct.price}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Stock</span>
                    <p className="text-lg font-semibold">
                      {selectedProduct.stock}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">SKU</span>
                    <p className="text-lg font-semibold">
                      {selectedProduct.sku}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <p className="text-lg font-semibold capitalize">
                      {selectedProduct.status}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Description</span>
                  <p className="text-gray-900 mt-1">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {(modalType === "edit" || modalType === "add") && (
          <div className="max-h-[80vh] overflow-y-auto px-1">
            <ProductForm
              mode={modalType}
              initialData={selectedProduct}
              categories={categories}
              onSubmit={handleProductSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;