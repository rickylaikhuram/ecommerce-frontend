// components/sections/CategoryShowcase.tsx
import { useAppSelector } from '../../redux/hook'; // Adjust path as needed
import type { Category as Categories } from '../../types/products.types'; // Adjust path as needed

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

// Redux state type (adjust according to your store structure)
interface RootState {
  categories: {
    categories: Categories[] | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}

interface CategoryShowcaseProps {
  categoryIndex: number; // The index of the parent category to display
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categoryIndex }) => {
  const { categories, status, error } = useAppSelector(
    (state: RootState) => state.categories
  );

  // Handle category click
  const handleCategoryClick = (categoryName: string): void => {
    const url = `/products?category=${encodeURIComponent(
      categoryName
    )}&sortBy=newest`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Handle image error
  const handleImageError = (
      e: React.SyntheticEvent<HTMLImageElement>
    ): void => {
      const target = e.target as HTMLImageElement;
  
      // Remove the error handler to avoid infinite loop
      target.onerror = null;
  
      // Set fallback image
      target.src =
        "https://via.placeholder.com/1200x400/6b7280/ffffff?text=Image+Not+Found";
    };

  // Get parent categories
  const getParentCategories = (): Categories[] => {
    return categories?.filter((category) => category.parentId === null) || [];
  };

  // Get the specific parent category by index
  const getSelectedCategory = (): Categories | null => {
    const parentCategories = getParentCategories();
    return parentCategories[categoryIndex] || null;
  };

  const selectedCategory = getSelectedCategory();
  const childCategories = selectedCategory?.children || [];

  // Loading state
  if (status === "loading") {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop by Club</h2>
            <p className="text-gray-600">Loading clubs...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded mt-4 w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop by Club</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  // If no selected category found
  if (!selectedCategory) {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop by Club</h2>
          <p className="text-gray-600">Category not found at index {categoryIndex}</p>
        </div>
      </section>
    );
  }

  // If no child categories
  if (childCategories.length === 0) {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shop by {selectedCategory.name}
          </h2>
          <p className="text-gray-600">No subcategories available</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="p-3 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shop by {selectedCategory.name}
            </h2>
            <p className="text-gray-600 md:text-lg">
              Authentic products from your favorite {selectedCategory.name.toLowerCase()}
            </p>
          </div>

          {/* Category Grid - Mobile horizontal scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6  py-2">
            <div className="flex space-x-8 w-max">
              {childCategories.map((category) => (
                <div
                  key={category.id}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-110 flex-shrink-0"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {/* Circular Image Container */}
                  <div className="relative">
                    {/* Image Container */}
                    <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-4 group-hover:ring-teal-500 group-hover:ring-opacity-60 transition-all duration-300">
                      {category.imageUrl ? (
                        <img
                          src={`${S3_BASE_URL}${category.imageUrl}`}
                          alt={category.altText || category.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-colors">
                          <span className="text-gray-500 text-xs text-center px-2">
                            {category.name}
                          </span>
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Category Name */}
                  <div className="mt-4 text-center">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Collection →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Grid - Desktop */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
            {childCategories.map((category) => (
              <div
                key={category.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-102"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Circular Image Container */}
                <div className="relative">
                  {/* Image Container */}
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-4 group-hover:ring-teal-500 group-hover:ring-opacity-60 transition-all duration-300">
                    {category.imageUrl ? (
                      <img
                        src={`${S3_BASE_URL}${category.imageUrl}`}
                        alt={category.altText || category.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-colors">
                        <span className="text-gray-500 text-xs text-center px-2">
                          {category.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Category Name */}
                <div className="mt-4 text-center">
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Collection →
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-3">
            <button 
              onClick={() => handleCategoryClick(selectedCategory.name)}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-teal-800"
            >
              View All {selectedCategory.name}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryShowcase;