import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";
import Button from "../../components/ui/Button";
import CategoryForm from "../../components/admin/CategoryForm";
import SubCategoryForm from "../../components/admin/SubCategoryForm";
import instance from "../../utils/axios";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<"list" | "add-category" | "edit-category" | "add-subcategory" | "edit-subcategory">("list");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [parentCategoryForSubCategory, setParentCategoryForSubCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch categories on mount and when returning to list view
  useEffect(() => {
    if (currentView === "list") {
      fetchCategories();
    }
  }, [currentView]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get("/api/admin/get/categories");
      const data = response.data.categories || response.data.category || [];
      
      // Build hierarchy from flat list
      const categoriesMap = new Map<string, Category>();
      const rootCategories: Category[] = [];
      
      // First pass: create all categories
      data.forEach((cat: Category) => {
        categoriesMap.set(cat.id, { ...cat, children: [] });
      });
      
      // Second pass: build hierarchy
      data.forEach((cat: Category) => {
        const category = categoriesMap.get(cat.id)!;
        if (cat.parentId === null) {
          rootCategories.push(category);
        } else {
          const parent = categoriesMap.get(cat.parentId);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(category);
          }
        }
      });
      
      setCategories(rootCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCategoriesFlat = (categories: Category[]): Category[] => {
    const flat: Category[] = [];
    const addToFlat = (cats: Category[]) => {
      cats.forEach(cat => {
        flat.push(cat);
        if (cat.children && cat.children.length > 0) {
          addToFlat(cat.children);
        }
      });
    };
    addToFlat(categories);
    return flat;
  };

  const handleToggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setParentCategoryForSubCategory(null);
    setCurrentView("add-category");
  };

  const handleAddSubCategory = (parentCategory?: Category) => {
    setParentCategoryForSubCategory(parentCategory || null);
    setSelectedCategory(null);
    setCurrentView("add-subcategory");
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setParentCategoryForSubCategory(null);
    // Determine if it's a category or subcategory based on parentId
    setCurrentView(category.parentId ? "edit-subcategory" : "edit-category");
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? All subcategories will also be deleted.")) return;
    
    try {
      await instance.delete(`/api/admin/delete/category/${categoryId}`);
      showNotification("success", "Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      showNotification("error", error.response?.data?.message || "Failed to delete category");
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setSubmitStatus({ type, message });
    setTimeout(() => {
      setSubmitStatus({ type: null, message: "" });
    }, 3000);
  };

  const handleFormSubmitSuccess = () => {
    showNotification("success", 
      currentView.includes("add") ? "Created successfully" : "Updated successfully"
    );
    setCurrentView("list");
    setSelectedCategory(null);
    setParentCategoryForSubCategory(null);
  };

  const handleFormCancel = () => {
    setCurrentView("list");
    setSelectedCategory(null);
    setParentCategoryForSubCategory(null);
  };

  // Filter categories based on search
  const filterCategories = (categories: Category[]): Category[] => {
    if (!searchTerm) return categories;
    
    const filtered: Category[] = [];
    categories.forEach(category => {
      const categoryMatches = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const childrenFiltered = category.children ? filterCategories(category.children) : [];
      
      if (categoryMatches || childrenFiltered.length > 0) {
        filtered.push({
          ...category,
          children: childrenFiltered
        });
      }
    });
    
    return filtered;
  };

  const filteredCategories = filterCategories(categories);

  // Calculate stats
  const allCategories = getAllCategoriesFlat(categories);
  const totalCategories = allCategories.filter(c => c.parentId === null).length;
  const totalSubCategories = allCategories.filter(c => c.parentId !== null).length;

  // Render Category Form
  if (currentView === "add-category" || (currentView === "edit-category" && !selectedCategory?.parentId)) {
    return (
      <CategoryForm
        mode={currentView === "add-category" ? "add" : "edit"}
        initialData={selectedCategory}
        onSubmit={handleFormSubmitSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  // Render SubCategory Form
  if (currentView === "add-subcategory" || (currentView === "edit-subcategory" || (currentView === "edit-category" && selectedCategory?.parentId))) {
    return (
      <SubCategoryForm
        mode={currentView.includes("add") ? "add" : "edit"}
        initialData={selectedCategory}
        parentCategory={parentCategoryForSubCategory}
        onSubmit={handleFormSubmitSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  // Loading state
  if (isLoading && currentView === "list") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading categories...</p>
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
          <p className="text-red-600 font-semibold">Error loading categories</p>
          <p className="text-slate-600 mt-2">{error}</p>
          <Button
            onClick={fetchCategories}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Render category tree
  const renderCategoryTree = (categories: Category[], level: number = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <div 
          className={`px-6 py-4 hover:bg-slate-50 transition-colors ${
            level > 0 ? 'bg-slate-50' : ''
          }`}
          style={{ paddingLeft: `${1.5 + level * 2}rem` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {category.children && category.children.length > 0 && (
                <button
                  onClick={() => handleToggleExpand(category.id)}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              )}
              {(!category.children || category.children.length === 0) && (
                <div className="w-7" />
              )}
              <Folder className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-medium text-slate-800">{category.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                {category.children?.length || 0} subcategories
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAddSubCategory(category)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  title="Add subcategory"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Edit category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {expandedCategories.has(category.id) && category.children && category.children.length > 0 && (
          <div>
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Main list view
  return (
    <div className="space-y-6">
      {/* Notification */}
      {submitStatus.type && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 transform transition-all duration-300 ${
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {submitStatus.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm font-medium">{submitStatus.message}</p>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
            <p className="text-slate-600 mt-1">Manage your product categories</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchCategories}
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
              onClick={() => handleAddSubCategory()}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-4"
            >
              <Plus className="w-4 h-4" />
              Add Subcategory
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-5"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Categories</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1">{totalCategories}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Subcategories</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{totalSubCategories}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FolderOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{allCategories.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No categories found</p>
            {categories.length === 0 && !searchTerm && (
              <button
                onClick={handleAddCategory}
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Create your first category
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {renderCategoryTree(filteredCategories)}
          </div>
        )}
      </div>

    </div>
  );
};

export default Categories;