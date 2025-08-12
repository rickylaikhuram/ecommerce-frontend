import React, { useState } from "react";
import type { Category } from "../../types/products.types";


interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  handleCategoryChange: (name: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  handleCategoryChange,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id} className="mb-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleCategoryChange(category.name)}
              className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {category.name}
            </button>

            {category.children?.length > 0 && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="px-2 text-gray-500 hover:text-gray-700"
              >
                {expanded[category.id] ? "−" : "+"}
              </button>
            )}
          </div>

          {expanded[category.id] && category.children?.length > 0 && (
            <div className="ml-4 mt-1">
              {category.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleCategoryChange(child.name)}
                  className={`block w-full text-left px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedCategory === child.name
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default CategoryList