// pages/ProductDetails.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  fetchCart,
  addToCart,
  updateQuantity,
  updateQuantityOptimistic,
} from "../redux/slice/cart";
import {
  toggleWishlist,
  selectIsProductWishlisted,
} from "../redux/slice/wishlist";
import type { Product } from "../types/products.types";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Package,
  Clock,
  MapPin,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import GuestModal from "../components/common/GuestModal";
import SizeGuideModal from "../components/common/SizeGuideModal";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

// Utility function to create SEO-friendly URL slug from product name
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with single hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

// Utility function to create full product URL with name slug and UUID
const createProductUrl = (productName: string, productId: string): string => {
  const slug = createSlug(productName);
  return `${slug}--${productId}`; // Use double dash as separator before UUID
};

// Utility function to extract UUID from slug (handles various URL formats)
const extractIdFromSlug = (slug: string): string => {
  // UUID regex pattern
  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

  // Method 1: Look for double dash separator
  const doubleDashIndex = slug.lastIndexOf("--");
  if (doubleDashIndex !== -1) {
    const idPart = slug.substring(doubleDashIndex + 2);
    if (uuidRegex.test(idPart)) {
      return idPart;
    }
  }

  // Method 2: Extract UUID from anywhere in the string
  const uuidMatch = slug.match(uuidRegex);
  if (uuidMatch) {
    return uuidMatch[0];
  }

  // Method 3: If entire slug looks like a UUID (backward compatibility)
  if (uuidRegex.test(slug)) {
    return slug;
  }

  // Fallback: return the slug as is (shouldn't happen with proper URLs)
  return slug;
};

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "shipping" | "returns"
  >("description");

  // Modal state
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [guestReason, setGuestReason] = useState<"cart" | "wishlist">(
    "wishlist"
  );

  // Share functionality state
  const [copySuccess, setCopySuccess] = useState(false);

  // Redux state
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const cartLoading = useAppSelector(
    (state) => state.cart.status === "loading"
  );
  const actionLoading = useAppSelector((state) => state.cart.actionLoading);
  const isWishlisted = useAppSelector((state) =>
    product?.id ? selectIsProductWishlisted(product.id)(state) : false
  );
  const wishlistLoading = useAppSelector((state) => state.wishlist.loading);
  const { user, status } = useAppSelector((state) => state.auth);
  const isAuthenticated = user?.role === "user" && status === "succeeded";

  // Refs
  const debounceTimeoutRef = useRef<number | null>(null);
  const DEBOUNCE_DELAY = 1000;

  // Helper function to get cart item
  const getCartItem = (productId: string, stockName: string) => {
    if (!cart) return undefined;
    return cart.items.find(
      (item) => item.productId === productId && item.stockName === stockName
    );
  };

  // Computed values
  const cartItem = React.useMemo(() => {
    if (!product?.id || !selectedSize || cartLoading || !cart) return null;
    return getCartItem(product.id, selectedSize);
  }, [product, selectedSize, cart, cartLoading]);

  const isProductInCart = !!cartItem;
  const displayQuantity = quantity;

  // Effects
  useEffect(() => {
    if (slug) {
      const productId = extractIdFromSlug(slug);
      console.log("before call");
      fetchProduct(productId);
    }
  }, [slug]);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (isProductInCart && cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [isProductInCart, cartItem]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Update URL to SEO-friendly format when product loads
  useEffect(() => {
    if (product && product.name && product.id) {
      const correctSlug = createProductUrl(product.name, product.id);
      if (slug !== correctSlug) {
        window.history.replaceState(null, "", `/products/${correctSlug}`);
      }
    }
  }, [product, slug]);

  // Functions
  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await instance.get(`/product/${productId}`);

      if (!response.data?.product) {
        throw new Error("Product not found");
      }

      const productData = response.data.product;

      // Sort images by position
      const sortedImages = productData.images
        ? [...productData.images].sort(
            (a: any, b: any) => a.position - b.position
          )
        : [];

      setProduct({
        ...productData,
        images: sortedImages,
      });

      // Auto-select first available size
      const availableSize = productData.productSizes?.find(
        (size: any) => size.stock > 0
      );
      if (availableSize) {
        setSelectedSize(availableSize.stockName);
      }
    } catch (err: any) {
      console.error("Error fetching product:", err);
      setError(
        err.response?.status === 404
          ? "Product not found"
          : "Failed to load product details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const productUrl = window.location.href;

    // Try native sharing first (mobile devices)
    if (navigator.share && window.innerWidth <= 768) {
      try {
        await navigator.share({
          title: product?.name || "Check out this product",
          text: `${product?.name} - ₹${product?.discountedPrice}`,
          url: productUrl,
        });
        return;
      } catch (err) {
        // User cancelled or sharing not supported, fall through to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = productUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (copyErr) {
        console.error("Failed to copy URL:", copyErr);
        alert("Failed to copy link. Please copy manually from address bar.");
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product?.id) return;

    // Check if size is required but not selected
    if (
      !selectedSize &&
      product.productSizes &&
      product.productSizes.length > 0
    ) {
      alert("Please select a size");
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      setGuestReason("cart");
      setShowGuestModal(true);
      return;
    }

    try {
      if (isProductInCart) {
        // If already in cart, navigate to cart page
        navigate("/cart");
      } else {
        // Add to cart with selected quantity
        await dispatch(
          addToCart({
            productId: product.id,
            stockName: selectedSize,
            quantity,
          })
        ).unwrap();

        // Refresh cart to get updated data
        dispatch(fetchCart());
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    const selectedStock = product?.productSizes?.find(
      (s) => s.stockName === selectedSize
    );
    const maxStock = selectedStock?.stock || 10;

    if (newQuantity >= 1 && newQuantity <= maxStock) {
      // Update UI immediately
      setQuantity(newQuantity);

      if (isProductInCart && cartItem) {
        // Clear existing timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Optimistic update first
        dispatch(
          updateQuantityOptimistic({
            itemId: cartItem.id,
            quantity: newQuantity,
          })
        );

        // Set new timeout for debounced API call
        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            await dispatch(
              updateQuantity({
                itemId: cartItem.id,
                quantity: newQuantity,
              })
            ).unwrap();
          } catch (err) {
            console.error("Error updating cart quantity:", err);
            // Reset to cart quantity on error
            if (cartItem) {
              setQuantity(cartItem.quantity);
            }
            // Refresh cart to get correct state
            dispatch(fetchCart());
            alert("Failed to update quantity. Please try again.");
          }
        }, DEBOUNCE_DELAY);
      }
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setGuestReason("wishlist");
      setShowGuestModal(true);
      return;
    }

    if (!product?.id) {
      console.error("Cannot add to wishlist: Product ID is missing");
      return;
    }

    dispatch(toggleWishlist(product.id));
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const calculateDiscount = () => {
    if (!product?.discountedPrice || !product?.originalPrice) return 0;
    if (product.originalPrice <= product.discountedPrice) return 0;
    return Math.round(
      ((product.originalPrice - product.discountedPrice) /
        product.originalPrice) *
        100
    );
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-emerald-600 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
            {error || "Product not found"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            The product you're looking for might have been removed or is
            temporarily unavailable.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Computed values for rendering
  const discount = calculateDiscount();
  const hasStock = product.productSizes?.some((size) => size.stock > 0) ?? true;
  const selectedStock = product.productSizes?.find(
    (s) => s.stockName === selectedSize
  );
  const isActionLoading =
    actionLoading === "add" || actionLoading === product.id;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="font-semibold text-gray-900 text-sm truncate mx-3 flex-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? "text-red-500 bg-red-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Share product"
                >
                  {copySuccess ? (
                    <CheckCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </button>
                {copySuccess && (
                  <div className="absolute -bottom-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    Link copied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Breadcrumb */}
        <div className="hidden lg:block bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav
              className="flex items-center space-x-2 text-sm overflow-x-auto"
              aria-label="Breadcrumb"
            >
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <button
                onClick={() =>
                  navigate(
                    `/products?category=${product.category?.name}&sortBy=newest`
                  )
                }
                className="text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                {product.category?.name || "Products"}
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-medium truncate">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-12 pb-4 lg:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-3 lg:space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-square relative">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={`${S3_BASE_URL}${product.images[selectedImage]?.imageUrl}`}
                        alt={
                          product.images[selectedImage]?.altText || product.name
                        }
                        className="w-full h-full object-contain p-3 lg:p-4"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.png";
                        }}
                      />
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-red-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                          -{discount}%
                        </div>
                      )}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 lg:p-2.5 rounded-full shadow-lg transition-all group"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-emerald-600" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 lg:p-2.5 rounded-full shadow-lg transition-all group"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-emerald-600" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Package className="w-16 lg:w-24 h-16 lg:h-24 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`
                        relative flex-shrink-0 w-16 h-16 lg:w-24 lg:h-24 rounded-lg lg:rounded-xl overflow-hidden 
                        transition-all duration-200 transform hover:scale-105
                        ${
                          selectedImage === index
                            ? "ring-2 ring-emerald-600 ring-offset-2"
                            : "ring-1 ring-gray-200"
                        }
                      `}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={`${S3_BASE_URL}${image.imageUrl}`}
                        alt={image.altText || `Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-emerald-600/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-4 lg:space-y-6">
              {/* Title and Badges */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs lg:text-sm font-medium text-emerald-600 bg-emerald-50 px-2 lg:px-3 py-1 rounded-full">
                    {product.category?.name || "Uncategorized"}
                  </span>
                  {product.totalSales > 50 && (
                    <span className="text-xs lg:text-sm font-medium text-orange-600 bg-orange-50 px-2 lg:px-3 py-1 rounded-full">
                      🔥 Best Seller
                    </span>
                  )}
                  {isProductInCart && (
                    <span className="text-xs lg:text-sm font-medium text-green-600 bg-green-50 px-2 lg:px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      In Cart ({displayQuantity})
                    </span>
                  )}
                </div>

                <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Section */}
              <div>
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                  ₹{Number(product.discountedPrice || 0).toFixed(2)}
                </span>
                {product.originalPrice &&
                  Number(product.originalPrice) >
                    Number(product.discountedPrice || 0) && (
                    <>
                      <span className="text-lg lg:text-2xl text-gray-400 line-through pl-2">
                        ₹{Number(product.originalPrice).toFixed(2)}
                      </span>
                      <span className="text-xs lg:text-sm font-semibold text-green-600 bg-green-100 px-2 lg:px-3 py-1 rounded-full">
                        Save ₹
                        {(
                          product.originalPrice - (product.discountedPrice || 0)
                        ).toFixed(2)}
                      </span>
                    </>
                  )}

                {/* Total price for multiple quantities */}
                {displayQuantity > 1 && (
                  <div className="mt-2 pt-2 border-t border-emerald-200">
                    <p className="text-sm text-gray-600">
                      Total ({displayQuantity} items):
                      <span className="font-semibold text-gray-900 ml-1">
                        ₹
                        {(
                          Number(product.discountedPrice || 0) * displayQuantity
                        ).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Size Selection */}
              {product.productSizes && product.productSizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Select Size</h3>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="font-semibold text-emerald-700 cursor-pointer hover:text-emerald-800 transition-colors"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                    {product.productSizes.map((size) => (
                      <div
                        key={size.stockName}
                        className="flex flex-col items-center"
                      >
                        <button
                          onClick={() => {
                            setSelectedSize(size.stockName);
                            // Reset quantity when changing size
                            const newCartItem = getCartItem(
                              product.id!,
                              size.stockName
                            );
                            if (newCartItem) {
                              setQuantity(newCartItem.quantity);
                            } else {
                              setQuantity(1);
                            }
                            // Clear pending debounced updates
                            if (debounceTimeoutRef.current) {
                              clearTimeout(debounceTimeoutRef.current);
                            }
                          }}
                          disabled={size.stock === 0}
                          className={`
                            relative p-2 rounded-xl font-medium text-sm transition-all duration-200 min-h-[48px] w-full
                            ${
                              selectedSize === size.stockName
                                ? "bg-emerald-600 text-white shadow-lg transform scale-105"
                                : size.stock === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white border-2 border-gray-200 hover:border-emerald-600 text-gray-700"
                            }
                          `}
                        >
                          <span>{size.stockName}</span>

                          {/* Low stock indicator */}
                          {size.stock > 0 && size.stock < 10 && (
                            <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs px-1.5 py-0.5 rounded-full font-normal">
                              {size.stock} left
                            </span>
                          )}
                        </button>

                        {/* Out of stock label */}
                        {size.stock === 0 && (
                          <span className="text-xs text-red-500 mt-1 font-normal">
                            Out of stock
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {selectedSize && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Quantity
                    {isProductInCart && (
                      <span className="text-xs font-normal text-green-600 ml-2">
                        (Currently in cart)
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() =>
                          handleQuantityChange(displayQuantity - 1)
                        }
                        className="p-3 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={displayQuantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="px-6 py-3 font-semibold min-w-[50px] text-center">
                        {displayQuantity}
                      </div>
                      <button
                        onClick={() =>
                          handleQuantityChange(displayQuantity + 1)
                        }
                        disabled={
                          displayQuantity >= (selectedStock?.stock || 10)
                        }
                        className="p-3 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {selectedSize && selectedStock && (
                      <span className="text-sm text-gray-600">
                        {selectedStock.stock} available
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !hasStock ||
                    isActionLoading ||
                    cartLoading ||
                    (product.productSizes?.length > 0 && !selectedSize)
                  }
                  className={`
                    flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 
                    flex items-center justify-center gap-2 transform hover:scale-[1.02]
                    ${
                      !hasStock ||
                      (product.productSizes?.length > 0 && !selectedSize) ||
                      cartLoading
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : isProductInCart
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                    }
                  `}
                >
                  {cartLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Checking Cart...
                    </>
                  ) : !hasStock ? (
                    <>Out of Stock</>
                  ) : product.productSizes?.length > 0 && !selectedSize ? (
                    <>Select a Size</>
                  ) : isActionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {isProductInCart ? "Going to Cart..." : "Adding..."}
                    </>
                  ) : isProductInCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Go to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105
                    ${
                      isWishlisted
                        ? "border-red-500 bg-red-50 text-red-500"
                        : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                    }
                  `}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>

                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-all duration-200 transform hover:scale-105 bg-white"
                    aria-label="Share product"
                  >
                    {copySuccess ? (
                      <CheckCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </button>
                  {copySuccess && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                      Link copied!
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Status Info */}
              {isProductInCart && cartItem && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-800 font-medium flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      This item is in your cart
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Size:{" "}
                      <span className="font-medium">{cartItem.stockName}</span>
                      {" • "}
                      Qty:{" "}
                      <span className="font-medium">{displayQuantity}</span>
                    </span>
                    <button
                      onClick={() => navigate("/cart")}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      View in Cart →
                    </button>
                  </div>
                </div>
              )}

              {/* Service Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 lg:p-4 bg-green-50 rounded-lg lg:rounded-xl">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Secure Payment
                    </p>
                    <p className="text-xs text-gray-600">100% Protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 lg:p-4 bg-purple-50 rounded-lg lg:rounded-xl">
                  <RotateCcw className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Easy Returns
                    </p>
                    <p className="text-xs text-gray-600">7 Day Policy</p>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="bg-amber-50 rounded-lg lg:rounded-xl p-3 lg:p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm lg:text-base">
                    Estimated Delivery
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Order today and receive by{" "}
                    {new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-8 lg:mt-12 bg-white rounded-lg lg:rounded-2xl shadow-sm overflow-hidden mb-20 lg:mb-0">
            <div className="border-b">
              <div className="flex overflow-x-auto">
                {(["description", "shipping", "returns"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                      px-4 lg:px-6 py-3 lg:py-4 font-medium text-sm lg:text-base capitalize whitespace-nowrap transition-all
                      ${
                        activeTab === tab
                          ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                          : "text-gray-600 hover:text-gray-900"
                      }
                    `}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="p-4 lg:p-8">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Description
                  </h3>
                  <div className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    {product.description ? (
                      <p>{product.description}</p>
                    ) : (
                      <p className="text-gray-400 italic">
                        No description available for this product.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Information
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm lg:text-base">
                    At Clover Arena, we strive to deliver your football jerseys
                    quickly and safely to your doorstep.
                  </p>

                  <div className="space-y-6">
                    {/* Processing Time */}
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 mb-2">
                          Processing Time
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            • Orders are typically processed within 1–2 business
                            days after payment confirmation
                          </li>
                          <li>
                            • During high-demand periods, processing may take a
                            little longer
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 mb-2">
                          Shipping Methods & Delivery Time
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Reliable shipping across India</li>
                          <li>
                            • Standard delivery: 3–7 business days (depending on
                            location)
                          </li>
                          <li>
                            • Remote areas may take up to 10 business days
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Shipping Charges */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 mb-2">
                          Shipping Charges
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            • Shipping charges calculated at checkout based on
                            location and order size
                          </li>
                          <li>
                            • Free shipping promotions may apply on qualifying
                            orders
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Order Tracking */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Order Tracking
                      </h4>
                      <p className="text-sm text-blue-800">
                        Track your order status directly on our website by
                        visiting the Order Status page and entering your order
                        details. No need to wait for emails – stay updated
                        anytime!
                      </p>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h4 className="font-medium text-amber-900 mb-2">
                        Important Notes
                      </h4>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>
                          • Please ensure your shipping address is correct
                          before placing the order
                        </li>
                        <li>
                          • We are not responsible for delays due to incorrect
                          addresses
                        </li>
                        <li>
                          • Contact us at{" "}
                          <span className="font-medium">
                            cloverarena.cs@gmail.com
                          </span>{" "}
                          for delivery issues
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "returns" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Return Policy
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm lg:text-base">
                    At Clover Arena, we want you to be completely satisfied with
                    your purchase. Your satisfaction is our top priority.
                  </p>

                  <div className="space-y-6">
                    {/* 7-Day Return Guarantee */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        7-Day Return Guarantee
                      </h4>
                      <p className="text-sm text-green-800">
                        Return your football jersey within 7 days from the date
                        of delivery in its original condition and packaging for
                        a full refund or exchange.
                      </p>
                    </div>

                    {/* Return Process */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        How to Return
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ol className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              1
                            </span>
                            Contact our customer support team to initiate the
                            return process
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              2
                            </span>
                            We'll guide you through every step of the return
                            process
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              3
                            </span>
                            Send the item back in original condition with all
                            tags intact
                          </li>
                        </ol>
                      </div>
                    </div>

                    {/* Return Conditions */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Return Conditions
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          Items must be unworn and unwashed
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          Include all original tags and packaging
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          Return must be initiated within 7 days of delivery
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          Items must be in original condition and packaging
                        </li>
                      </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h4 className="font-medium text-emerald-900 mb-2">
                        Need Help?
                      </h4>
                      <p className="text-sm text-emerald-800">
                        Our goal is to make your shopping experience smooth,
                        safe, and worry-free. Contact us at{" "}
                        <span className="font-medium">
                          cloverarena.cs@gmail.com
                        </span>{" "}
                        for any return queries.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Mobile Sticky Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 shadow-2xl p-4 z-50 safe-area-padding-bottom">
          {/* Quantity controls when product is in cart */}
          {isProductInCart && selectedSize && (
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Quantity in cart:
              </span>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <button
                  onClick={() => handleQuantityChange(displayQuantity - 1)}
                  className="p-2 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={displayQuantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="px-4 py-2 font-semibold min-w-[50px] text-center">
                  {displayQuantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(displayQuantity + 1)}
                  disabled={displayQuantity >= (selectedStock?.stock || 10)}
                  className="p-2 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Price and action section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                {isProductInCart ? "Total in cart" : "Total Price"}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-gray-900">
                  ₹
                  {(
                    Number(product.discountedPrice || 0) * displayQuantity
                  ).toFixed(2)}
                </p>
                {isProductInCart && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    In Cart
                  </span>
                )}
              </div>
              {isProductInCart && cartItem && (
                <p className="text-xs text-gray-500 mt-1">
                  {displayQuantity} item{displayQuantity > 1 ? "s" : ""} • Size:{" "}
                  {cartItem.stockName}
                </p>
              )}
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={
              !hasStock ||
              isActionLoading ||
              cartLoading ||
              (product.productSizes?.length > 0 && !selectedSize)
            }
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 
              flex items-center justify-center gap-2 shadow-lg
              ${
                !hasStock || (product.productSizes?.length > 0 && !selectedSize)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : isProductInCart
                  ? "bg-green-600 hover:bg-green-700 text-white transform active:scale-95"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white transform active:scale-95"
              }
            `}
          >
            {cartLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Checking...
              </>
            ) : !hasStock ? (
              <>Out of Stock</>
            ) : product.productSizes?.length > 0 && !selectedSize ? (
              <>Select a Size First</>
            ) : isActionLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {isProductInCart ? "Going to Cart..." : "Adding..."}
              </>
            ) : isProductInCart ? (
              <>
                <Check className="w-5 h-5" />
                Go to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
        <div className="lg:hidden h-20"></div>
      </div>

      {/* Guest Modal */}
      <GuestModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        reason={guestReason}
      />
      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        images={product?.images}
        productName={product?.name}
      />
    </>
  );
};

export default ProductDetails;
