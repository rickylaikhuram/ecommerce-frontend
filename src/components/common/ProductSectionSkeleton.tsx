// components/section/ProductSectionSkeleton.tsx
import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductSectionSkeletonProps {
  sectionClassName?: string;
  containerClassName?: string;
  showNavigation?: boolean;
  cardCount?: number;
  showTitle?: boolean;
  showViewAll?: boolean;
}

const ProductSectionSkeleton: React.FC<ProductSectionSkeletonProps> = ({ 
  sectionClassName = "",
  containerClassName = "container mx-auto px-4 py-8",
  showNavigation = true,
  cardCount = 4,
  showTitle = true,
  showViewAll = true
}) => {
  return (
    <section className={`${sectionClassName} animate-pulse`}>
      <div className={containerClassName}>
        <div className="relative">
          {/* Header Skeleton */}
          {showTitle && (
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-4">
                {/* Title skeleton */}
                <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-200 rounded-lg" />
                {/* Subtitle skeleton (optional) */}
                <div className="hidden sm:block h-5 w-32 bg-gray-100 rounded" />
              </div>
              
              {/* View All button skeleton */}
              {showViewAll && (
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-100 rounded-lg" />
              )}
            </div>
          )}

          {/* Navigation Buttons Skeleton - Desktop only */}
          {showNavigation && (
            <>
              {/* Previous Button */}
              <div className="absolute left-0 sm:-left-2 lg:-left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300" />
                </div>
              </div>

              {/* Next Button */}
              <div className="absolute right-0 sm:-right-2 lg:-right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300" />
                </div>
              </div>
            </>
          )}

          {/* Product Cards Container */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4 sm:gap-5 lg:gap-6">
              {/* Mobile: 2 cards, Tablet: 3 cards, Desktop: 4 cards */}
              {Array.from({ length: cardCount }).map((_, index) => (
                <div 
                  key={`skeleton-card-${index}`}
                  className={`
                    flex-shrink-0 
                    w-[calc(50%-8px)] 
                    sm:w-[calc(33.333%-13.33px)] 
                    lg:w-[calc(25%-18px)]
                    ${index >= 2 ? 'hidden sm:block' : ''}
                    ${index >= 3 ? 'sm:hidden lg:block' : ''}
                  `}
                >
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar - Desktop only */}
          {showNavigation && (
            <div className="hidden md:block mt-6">
              <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1/4 bg-gray-200 rounded-full" />
              </div>
            </div>
          )}

          {/* Dots Navigation - Mobile only */}
          {showNavigation && (
            <div className="flex justify-center items-center gap-2 mt-4 md:hidden">
              {Array.from({ length: Math.min(5, Math.ceil(cardCount / 2)) }).map((_, index) => (
                <div 
                  key={`dot-skeleton-${index}`}
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${index === 0 
                      ? 'w-6 bg-gray-300' 
                      : 'w-2 bg-gray-200'
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSectionSkeleton;