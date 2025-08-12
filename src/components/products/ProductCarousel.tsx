// components/ProductCarousel.tsx
import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductGridCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from "../../types/products.types"

interface ProductCarouselProps {
  title?: string;
  products: Product[];
  onToggleWishlist?: (productId: string) => void;
  wishlistedItems?: string[];
  onProductClick?: (productId: string) => void;
  showNavigation?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  products,
  onToggleWishlist,
  wishlistedItems = [],
  onProductClick,
  showNavigation = true,
  autoScroll = false,
  autoScrollInterval = 5000,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check scroll position to update navigation buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Update current index for indicators
      const cardWidth = window.innerWidth < 640 ? 160 : window.innerWidth < 768 ? 256 : 320;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  // Responsive scroll function
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Adjust scroll amount based on screen size
      const screenWidth = window.innerWidth;
      let scrollAmount;
      
      if (screenWidth < 640) {
        scrollAmount = 160; // Mobile: scroll by one small card
      } else if (screenWidth < 768) {
        scrollAmount = 256; // Tablet: scroll by one medium card
      } else {
        scrollAmount = 320; // Desktop: scroll by one large card
      }
      
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll && !isHovered && products.length > 0) {
      const interval = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          
          // If we've reached the end, scroll back to start
          if (scrollLeft >= scrollWidth - clientWidth - 10) {
            scrollContainerRef.current.scrollTo({
              left: 0,
              behavior: 'smooth'
            });
          } else {
            scroll('right');
          }
        }
      }, autoScrollInterval);

      return () => clearInterval(interval);
    }
  }, [autoScroll, isHovered, autoScrollInterval, products.length]);

  // Update scroll position on mount and scroll
  useEffect(() => {
    checkScrollPosition();
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [products]);

  if (products.length === 0) {
    return null;
  }

  // Calculate visible products based on screen size
  const getVisibleProducts = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) return 2;
    if (screenWidth < 768) return 3;
    if (screenWidth < 1024) return 3;
    return 4;
  };

  const visibleProducts = getVisibleProducts();
  const totalPages = Math.ceil(products.length / visibleProducts);

  return (
    <div 
      className="product-carousel-container w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          
          {/* Desktop Navigation Buttons */}
          {showNavigation && products.length > visibleProducts && (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  canScrollLeft 
                    ? 'bg-white shadow-md hover:shadow-lg text-gray-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  canScrollRight 
                    ? 'bg-white shadow-md hover:shadow-lg text-gray-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Navigation Button (Overlay) - Hidden on mobile */}
        {showNavigation && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 lg:p-3 bg-white/90 backdrop-blur-sm rounded-r-lg shadow-lg opacity-0 hover:opacity-100 lg:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        )}

        {/* Right Navigation Button (Overlay) - Hidden on mobile */}
        {showNavigation && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 lg:p-3 bg-white/90 backdrop-blur-sm rounded-l-lg shadow-lg opacity-0 hover:opacity-100 lg:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        )}

        {/* Gradient Overlays - Adjusted for mobile */}
        {canScrollLeft && (
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none" />
        )}

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 sm:pb-4 -mx-2 px-2 sm:mx-0 sm:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-40 xs:w-48 sm:w-64 md:w-72 lg:w-80"
            >
              <ProductCard
                product={product}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistedItems.includes(product.id!)}
                onProductClick={onProductClick}
              />
            </div>
          ))}
          
          {/* Padding element for better scroll experience on mobile */}
          <div className="flex-shrink-0 w-2 sm:hidden" />
        </div>
      </div>

      {/* Mobile Navigation - Swipe indicator */}
      {products.length > visibleProducts && (
        <div className="sm:hidden flex items-center justify-center mt-4 text-xs text-gray-500">
          <span>Swipe for more →</span>
        </div>
      )}

      {/* Scroll Indicators - Responsive */}
      {products.length > visibleProducts && (
        <div className="flex justify-center mt-4 sm:mt-6 gap-1">
          {Array.from({ length: totalPages }).map((_, index) => {
            const isCurrent = Math.floor(currentIndex / visibleProducts) === index;
            return (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = window.innerWidth < 640 ? 160 : window.innerWidth < 768 ? 256 : 320;
                    scrollContainerRef.current.scrollTo({
                      left: index * cardWidth * visibleProducts,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`rounded-full transition-all duration-300 ${
                  isCurrent 
                    ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-blue-600' 
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;