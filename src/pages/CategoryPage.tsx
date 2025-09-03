import React, { useEffect } from "react";
import { MoveRight } from "lucide-react";
import { fetchCategories } from "../redux/slice/categories"; // Adjust path as needed
import type { Category as Categories } from "../types/products.types";
import HeroBanner from "../components/section/HeroBanner";
import Footer from "../components/section/Footer";
import FeatureSection from "../components/section/FeatureSection";
import { useAppDispatch, useAppSelector } from "../redux/hook";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

// Redux state type (adjust according to your store structure)
interface RootState {
  categories: {
    categories: Categories[] | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}

const CategoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, status, error } = useAppSelector(
    (state: RootState) => state.categories
  );

  // Fetch categories when component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

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
    target.src =
      "https://via.placeholder.com/200x200/6b7280/ffffff?text=No+Image";
  };

  // Get parent categories (they already have children populated)
  const getParentCategories = (): Categories[] => {
    return categories?.filter((category) => category.parentId === null) || [];
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => dispatch(fetchCategories() as any)}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no categories, return empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 text-lg">No categories found</p>
          </div>
        </div>
      </div>
    );
  }

  const parentCategories = getParentCategories();

  return (
    <>
      <HeroBanner />
      <div className="min-h-screen bg-gray-50 py-8 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {parentCategories.map((parentCategory) => {
            const childCategories = parentCategory.children || [];

            return (
              <div key={parentCategory.id} className="mb-12">
                {/* Parent Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Shop by {parentCategory.name}
                  </h2>
                  <button
                    onClick={() => handleCategoryClick(parentCategory.name)}
                    className="flex items-center bg-teal-600 px-3 py-1 hover:text-teal-700 font-medium transition-colors group shadow-lg rounded-lg"
                  >
                    <MoveRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Child Categories Grid */}
                {childCategories.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {childCategories.map((childCategory) => (
                      <div
                        key={childCategory.id}
                        className="text-center cursor-pointer group"
                        onClick={() => handleCategoryClick(childCategory.name)}
                      >
                        {/* Category Image */}
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                          <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 group-hover:shadow-lg transition-shadow duration-300">
                            {childCategory.imageUrl ? (
                              <img
                                src={`${S3_BASE_URL}${childCategory.imageUrl}`}
                                alt={
                                  childCategory.altText || childCategory.name
                                }
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-colors">
                                <span className="text-gray-500 text-xs text-center px-2">
                                  {childCategory.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Category Name */}
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                          {childCategory.name}
                        </h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No subcategories found for {parentCategory.name}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* If no parent categories found */}
          {parentCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No parent categories found
              </p>
            </div>
          )}
        </div>
      </div>
      <FeatureSection />
      <Footer />
    </>
  );
};

export default CategoryPage;
