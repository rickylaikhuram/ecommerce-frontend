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
import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Footer from "../../components/section/Footer";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import {
  fetchWishlistedIds,
  selectWishlistError,
} from "../../redux/slice/wishlist";
import FeatureSection from "../../components/section/FeatureSection";

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
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const { user, status } = useAppSelector((state) => state.auth);
  const isAuthenticated = user?.role === "user" && status === "succeeded";

  // Get wishlist state from Redux
  const wishlistError = useAppSelector(selectWishlistError);

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

  // Load wishlist only for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlistedIds());
    }
  }, [isAuthenticated, dispatch]);

  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/products/${productId}`);
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

  return (
    <div className="flex flex-col min-h-screen">
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
          onProductClick={handleProductClick}
          sectionClassName="bg-gray-50"
        />
      )}

      <CategoryShowcase categoryIndex={0}/>

      {/* Best Sellers Section - Lazy load */}
      <LazyProductSection
        title="Best Sellers"
        fetcher={() => productService.getBestsellers("week", 10)}
        onProductClick={handleProductClick}
        autoScroll={true}
        autoScrollInterval={5000}
        cardCount={4}
      />

      <CategoryShowcase categoryIndex={1}/>

      {/* Featured Products Section - Lazy load */}
      <LazyProductSection
        title="Featured Products"
        fetcher={() => productService.getTrendingProducts(8)}
        onProductClick={handleProductClick}
        sectionClassName="bg-gradient-to-r from-emerald-50 to-purple-50"
        containerClassName="container mx-auto px-4 py-12"
        cardCount={4}
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
        onProductClick={handleProductClick}
        sectionClassName="border-t border-gray-200 bg-gray-50"
        containerClassName="container mx-auto px-4 py-8 mt-8"
        cardCount={5}
      />

      {wishlistError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">{wishlistError}</p>
        </div>
      )}
      <FeatureSection/>
      <Footer />
    </div>
  );
};

export default Home;
