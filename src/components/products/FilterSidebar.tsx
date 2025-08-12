import React from "react";
import { X } from "lucide-react";
import type { Category } from "../../types/products.types";
import CategoryList from "./CategoryList";

interface FilterSidebarProps {
  // Data
  categories: Category[];
  availableSizes: string[];
  // Filter states
  selectedCategory: string;
  selectedSizes: string[];
  
  // Handlers
  onCategoryChange: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onClearFilters: () => void;
  onApplyFilters?: () => void; // For mobile
  
  // UI states
  isMobile?: boolean;
  onClose?: () => void; // For mobile modal
}


const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  selectedSizes,
  availableSizes,
  onCategoryChange,
  onSizeToggle,
  onClearFilters,
  onApplyFilters,
  isMobile = false,
  onClose,
}) => {
  const handleSizeToggle = (size: string) => {
    onSizeToggle(size);
  };

  return (
    <div
      className={`${isMobile ? "p-6" : "space-y-6"} ${
        isMobile ? "h-full overflow-y-auto" : ""
      }`}
    >
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Categories section */}
      <div className={isMobile ? "mb-8" : ""}>
        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          <CategoryButton
            label="All Categories"
            isSelected={!selectedCategory}
            onClick={() => onCategoryChange("")}
          />
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            handleCategoryChange={onCategoryChange}
          />
        </div>
      </div>

      {/* Sizes section */}
      <div className={isMobile ? "mb-8" : ""}>
        <h3 className="font-semibold text-gray-900 mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => (
            <SizeButton
              key={size}
              size={size}
              isSelected={selectedSizes.includes(size)}
              onClick={() => handleSizeToggle(size)}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {isMobile ? (
        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={onClearFilters}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onApplyFilters}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      ) : (
        <div className="pt-6 border-t">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

// Category button component
interface CategoryButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isSelected
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
};

// Size button component
interface SizeButtonProps {
  size: string;
  isSelected: boolean;
  onClick: () => void;
}

const SizeButton: React.FC<SizeButtonProps> = ({ size, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
        isSelected
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
      }`}
      aria-pressed={isSelected}
      aria-label={`Size ${size}`}
    >
      {size}
    </button>
  );
};

export default FilterSidebar;