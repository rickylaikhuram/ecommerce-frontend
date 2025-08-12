import React from "react";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedSizes: string[];
  priceRange: { min: number; max: number };
  onRemoveSearch: () => void;
  onRemoveCategory: () => void;
  onRemoveSize: (size: string) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedSizes,
  priceRange,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveSize,
  onClearAll,
}) => {
  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    selectedSizes.length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 1000;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>
      
      {/* Search filter */}
      {searchTerm && (
        <FilterTag label={`Search: ${searchTerm}`} onRemove={onRemoveSearch} />
      )}
      
      {/* Category filter */}
      {selectedCategory && (
        <FilterTag label={selectedCategory} onRemove={onRemoveCategory} />
      )}
      
      {/* Size filters */}
      {selectedSizes.map((size) => (
        <FilterTag
          key={size}
          label={`Size: ${size}`}
          onRemove={() => onRemoveSize(size)}
        />
      ))}
      
      {/* Price range filter */}
      {(priceRange.min > 0 || priceRange.max < 1000) && (
        <FilterTag
          label={`Price: $${priceRange.min} - $${priceRange.max}`}
          onRemove={() => {
            // This would need to be handled by parent component
            // Could add onRemovePriceRange prop if needed
          }}
        />
      )}
      
      {/* Clear all button */}
      <button
        onClick={onClearAll}
        className="ml-2 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
      >
        Clear all
      </button>
    </div>
  );
};

// Reusable filter tag component
interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
};

export default ActiveFilters;