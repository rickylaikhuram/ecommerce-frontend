// pages/Home.tsx
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import HeroSection from "../../components/section/HeroSection";
import ProductSection from "../../components/section/ProductSection";
import CategoryShowcase from "../../components/section/CategoryShowcase";
import ProductSectionSkeleton from "../../components/common/ProductSectionSkeleton";
import { productService } from "../../services/product.services";
import type { Product, ProductResponse } from "../../types/products.types";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Star, Shield, Truck, HeartHandshake } from "lucide-react";

// Error component
const ErrorSection: React.FC<{
  message: string;
  onRetry: () => void;
  sectionName: string;
}> = ({ message, onRetry, sectionName }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Failed to load {sectionName}
      </h3>
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  </div>
);

// Lazy loaded section component
const LazyProductSection: React.FC<{
  title: string;
  fetcher: () => Promise<ProductResponse>;
  onToggleWishlist: (productId: string) => void;
  wishlistedItems: string[];
  onProductClick: (productId: string) => void;
  sectionClassName?: string;
  containerClassName?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showNavigation?: boolean;
  cardCount?: number;
}> = ({ fetcher, ...props }) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "200px",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetcher();
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && products.length === 0) {
      fetchProducts();
    }
  }, [inView]);

  return (
    <div ref={ref}>
      {!inView || isLoading ? (
        <ProductSectionSkeleton
          sectionClassName={props.sectionClassName}
          containerClassName={props.containerClassName}
          showNavigation={props.showNavigation}
          cardCount={props.cardCount || 4}
        />
      ) : error ? (
        <ErrorSection
          message={error}
          onRetry={fetchProducts}
          sectionName={props.title}
        />
      ) : products.length === 0 ? (
        <div className={props.sectionClassName}>
          <div
            className={
              props.containerClassName || "container mx-auto px-4 py-8"
            }
          >
            <h2 className="text-2xl font-bold mb-4">{props.title}</h2>
            <p className="text-gray-500 text-center py-12">
              No products available in this section yet.
            </p>
          </div>
        </div>
      ) : (
        <ProductSection {...props} products={products} />
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Initial loading state for critical content
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [initialError, setInitialError] = useState<string | null>(null);

  // Load new arrivals immediately (above the fold content)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsInitialLoading(true);
        const response = await productService.getFilteredProducts({
          sortBy: "newest",
          limit: 8,
        });
        setNewArrivals(response.products);
      } catch (err) {
        setInitialError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  const retryInitialLoad = async () => {
    setInitialError(null);
    try {
      const response = await productService.getFilteredProducts({
        sortBy: "newest",
        limit: 8,
      });
      setNewArrivals(response.products);
    } catch (err) {
      setInitialError(
        err instanceof Error ? err.message : "Failed to load products"
      );
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your privacy and security are our top priorities",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50",
    },
    {
      icon: HeartHandshake,
      title: "24/7 Support",
      description: "Customer service when you need it",
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "30-day money-back guarantee",
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />

      {/* New Arrivals Section - Load immediately */}
      {isInitialLoading ? (
        <ProductSectionSkeleton sectionClassName="bg-gray-50" cardCount={4} />
      ) : initialError ? (
        <ErrorSection
          message={initialError}
          onRetry={retryInitialLoad}
          sectionName="New Arrivals"
        />
      ) : (
        <ProductSection
          title="New Arrivals"
          products={newArrivals}
          onToggleWishlist={handleToggleWishlist}
          wishlistedItems={wishlist}
          onProductClick={handleProductClick}
          sectionClassName="bg-gray-50"
        />
      )}

      <CategoryShowcase />

      {/* Best Sellers Section - Lazy load */}
      <LazyProductSection
        title="Best Sellers"
        fetcher={() => productService.getBestsellers("week", 10)}
        onToggleWishlist={handleToggleWishlist}
        wishlistedItems={wishlist}
        onProductClick={handleProductClick}
        autoScroll={true}
        autoScrollInterval={5000}
        cardCount={4}
      />

      <CategoryShowcase />

      {/* Hot Deals Section - Lazy load */}
      <LazyProductSection
        title="Hot Deals 🔥"
        fetcher={() =>
          productService.getFilteredProducts({
            sortBy: "price-desc",
            limit: 8,
          })
        }
        onToggleWishlist={handleToggleWishlist}
        wishlistedItems={wishlist}
        onProductClick={handleProductClick}
        sectionClassName="bg-gradient-to-br from-red-50 to-orange-50"
        autoScroll={true}
        autoScrollInterval={4000}
        cardCount={4}
      />

      {/* Featured Products Section - Lazy load */}
      <LazyProductSection
        title="Featured Products"
        fetcher={() => productService.getTrendingProducts(8)}
        onToggleWishlist={handleToggleWishlist}
        wishlistedItems={wishlist}
        onProductClick={handleProductClick}
        sectionClassName="bg-gradient-to-r from-blue-50 to-purple-50"
        containerClassName="container mx-auto px-4 py-12"
        cardCount={4}
      />

      {/* Electronics Section - Lazy load */}
      <LazyProductSection
        title="Electronics"
        fetcher={() =>
          productService.getProductsByCategory("electronics", "popular", 6)
        }
        onToggleWishlist={handleToggleWishlist}
        wishlistedItems={wishlist}
        onProductClick={handleProductClick}
        showNavigation={false}
        cardCount={3}
      />

      {/* You Might Also Like Section - Lazy load */}
      <LazyProductSection
        title="You Might Also Like"
        fetcher={() =>
          productService.getFilteredProducts({
            sortBy: "popular",
            limit: 5,
          })
        }
        onToggleWishlist={handleToggleWishlist}
        wishlistedItems={wishlist}
        onProductClick={handleProductClick}
        sectionClassName="border-t border-gray-200 bg-gray-50"
        containerClassName="container mx-auto px-4 py-8 mt-8"
        cardCount={5}
      />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Our Shop?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience possible
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="w-full sm:w-[45%] lg:w-[22%] px-4">
                  <div className="flex flex-row sm:flex-col items-center sm:items-center text-left sm:text-center group gap-4 sm:gap-0">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors shrink-0">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
