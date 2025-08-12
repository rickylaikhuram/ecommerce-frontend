// pages/ProductDetails.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import { useCartContext } from "../context/CartContext";
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
} from "lucide-react";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    cart,
    loading: cartLoading,
    addToCart,
    updateQuantity,
    getCartItem,
    actionLoading,
  } = useCartContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "shipping" | "returns"
  >("description");

  // Debounce ref
  const debounceTimeoutRef = useRef<number | null>(null);
  const DEBOUNCE_DELAY = 1000;

  // Get cart item for current product and selected size
  const cartItem = React.useMemo(() => {
    if (!product?.id || !selectedSize || cartLoading || !cart) return null;
    return getCartItem(product.id, selectedSize);
  }, [product, selectedSize, cart, cartLoading, getCartItem]);

  const isProductInCart = !!cartItem;

  // Always use local quantity state for display
  const displayQuantity = quantity;

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Sync local quantity when cart item changes
  useEffect(() => {
    if (isProductInCart && cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [isProductInCart, cartItem]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`api/product/${id}`);

      const sortedImages = [...response.data.product.images].sort(
        (a: any, b: any) => a.position - b.position
      );

      setProduct({
        ...response.data.product,
        images: sortedImages,
      });

      // Auto-select first available size
      const availableSize = response.data.product.productSizes?.find(
        (size: any) => size.stock > 0
      );
      if (availableSize) {
        setSelectedSize(availableSize.stockName);
      }

      setError(null);
    } catch (err) {
      setError("Failed to load product details");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !product.id) return;

    if (
      !selectedSize &&
      product.productSizes &&
      product.productSizes.length > 0
    ) {
      alert("Please select a size");
      return;
    }

    try {
      if (isProductInCart) {
        // If already in cart, navigate to cart page
        navigate("/cart");
      } else {
        // Add to cart with selected quantity
        await addToCart(product.id, selectedSize, quantity);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
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

        // Set new timeout for debounced API call
        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            await updateQuantity(cartItem.id, newQuantity);
          } catch (err) {
            console.error("Error updating cart quantity:", err);
            // Reset to cart quantity on error
            if (cartItem) {
              setQuantity(cartItem.quantity);
            }
            alert("Failed to update quantity. Please try again.");
          }
        }, DEBOUNCE_DELAY);
      }
    }
  };

  const calculateDiscount = () => {
    if (!product || !product.discountedPrice || !product.originalPrice)
      return 0;
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {error || "Product not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for might have been removed or is
            temporarily unavailable.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();
  const hasStock = product.productSizes?.some((size) => size.stock > 0) ?? true;
  const selectedStock = product.productSizes?.find(
    (s) => s.stockName === selectedSize
  );

  // Check if add to cart action is loading
  const isActionLoading =
    actionLoading === "add" || actionLoading === product.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm overflow-x-auto">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-500 whitespace-nowrap">
              {product.category?.name || "Products"}
            </span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-square relative">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={
                        `${S3_BASE_URL}${product.images[selectedImage]?.imageUrl}` ||
                        ""
                      }
                      alt={
                        product.images[selectedImage]?.altText || product.name
                      }
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png";
                      }}
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        -{discount}%
                      </div>
                    )}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-2.5 rounded-full shadow-lg transition-all group"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-2.5 rounded-full shadow-lg transition-all group"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-600" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Package className="w-16 sm:w-24 h-16 sm:h-24 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden 
                      transition-all duration-200 transform hover:scale-105
                      ${
                        selectedImage === index
                          ? "ring-2 ring-blue-600 ring-offset-2"
                          : "ring-1 ring-gray-200"
                      }
                    `}
                  >
                    <img
                      src={`${S3_BASE_URL}${image.imageUrl}`}
                      alt={image.altText}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-blue-600/10"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <span className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full">
                  {product.category?.name || "Uncategorized"}
                </span>
                {product.totalSales > 50 && (
                  <span className="text-xs sm:text-sm font-medium text-orange-600 bg-orange-50 px-2 sm:px-3 py-1 rounded-full">
                    🔥 Best Seller
                  </span>
                )}
                {isProductInCart && (
                  <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    In Cart ({displayQuantity})
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                {product.name || "Unnamed Product"}
              </h1>

              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-gray-600">
                  {product.totalSales || 0} sold
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  {product.views || 0} views
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  ₹{Number(product.discountedPrice ?? 0).toFixed(2)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > (product.discountedPrice || 0) && (
                    <>
                      <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through">
                        ₹{Number(product.originalPrice).toFixed(2)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600 bg-green-100 px-2 sm:px-3 py-1 rounded-full">
                        Save ₹
                        {(
                          product.originalPrice - (product.discountedPrice || 0)
                        ).toFixed(2)}
                      </span>
                    </>
                  )}
              </div>
              {/* Show total price if quantity > 1 */}
              {displayQuantity > 1 && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-sm text-gray-600">
                    Total ({displayQuantity} items):
                    <span className="font-semibold text-gray-900 ml-1">
                      ₹
                      {(
                        Number(product.discountedPrice ?? 0) * displayQuantity
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
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Select Size
                  </h3>
                  <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 underline">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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
                          // Clear pending states
                          if (debounceTimeoutRef.current) {
                            clearTimeout(debounceTimeoutRef.current);
                          }
                        }}
                        disabled={size.stock === 0}
                        className={`
                          relative py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200 min-h-[45px] w-full
                          ${
                            selectedSize === size.stockName
                              ? "bg-blue-600 text-white shadow-lg transform scale-105"
                              : size.stock === 0
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white border-2 border-gray-200 hover:border-blue-600 text-gray-700"
                          }
                        `}
                      >
                        <span>{size.stockName}</span>

                        {/* Stock indicator in top-right corner - only for low stock, not out of stock */}
                        {size.stock > 0 && size.stock < 10 && (
                          <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs px-1.5 py-0.5 rounded-full font-normal">
                            {`${size.stock} left`}
                          </span>
                        )}
                      </button>

                      {/* Out of stock text below button */}
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

            {/* Quantity Selector - Always show when size is selected */}
            {selectedSize && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  Quantity
                  {isProductInCart && (
                    <span className="text-xs font-normal text-green-600 ml-2">
                      (Currently in cart)
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => handleQuantityChange(displayQuantity - 1)}
                      className="p-2 sm:p-3 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={displayQuantity <= 1}
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <div className="px-4 sm:px-6 py-2 sm:py-3 font-semibold min-w-[40px] sm:min-w-[50px] text-center text-sm sm:text-base">
                      {displayQuantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(displayQuantity + 1)}
                      disabled={displayQuantity >= (selectedStock?.stock || 10)}
                      className="p-2 sm:p-3 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  {selectedSize && selectedStock && (
                    <span className="text-xs sm:text-sm text-gray-600">
                      {selectedStock.stock} available
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={
                  !hasStock ||
                  isActionLoading ||
                  cartLoading ||
                  (product.productSizes?.length > 0 && !selectedSize)
                }
                className={`
                  flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 
                  flex items-center justify-center gap-2 transform hover:scale-[1.02]
                  ${
                    !hasStock ||
                    (product.productSizes?.length > 0 && !selectedSize) ||
                    cartLoading
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isProductInCart
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
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
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    Go to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`
                  p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 transform hover:scale-105
                  ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                  }
                `}
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isWishlisted ? "fill-current" : ""
                  }`}
                />
              </button>
              <button className="p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-all duration-200 transform hover:scale-105 bg-white">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Show cart item info if product is in cart */}
            {isProductInCart && cartItem && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-green-800 font-medium">
                    ✅ This item is in your cart
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Size:{" "}
                    <span className="font-medium">{cartItem.stockName}</span> •
                    Qty: <span className="font-medium">{displayQuantity}</span>
                  </span>
                  <button
                    onClick={() => navigate("/cart")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View in Cart →
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-600">Orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-600">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">
                    Easy Returns
                  </p>
                  <p className="text-xs text-gray-600">30 Day Policy</p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  Estimated Delivery
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
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
        <div className="mt-8 sm:mt-12 bg-white rounded-lg sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {(["description", "shipping", "returns"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base capitalize whitespace-nowrap transition-all
                    ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                        : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "description" && (
              <div className="prose prose-gray max-w-none">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Product Description
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Shipping Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        Standard Shipping
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        5-7 business days • Free on orders over ₹500
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        Express Shipping
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        2-3 business days • ₹150.00
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Note:</strong> Delivery times may vary during peak
                    seasons.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "returns" && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Return Policy
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      30-Day Return Guarantee
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      We want you to be completely satisfied with your purchase.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      Return Conditions
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        Items must be unused and in original packaging
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        Include all tags and accessories
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4 z-40">
        {/* Quantity controls for mobile when product is in cart */}
        {isProductInCart && selectedSize && (
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600">Quantity in cart:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                onClick={() => handleQuantityChange(displayQuantity - 1)}
                className="p-2 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={displayQuantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="px-3 py-2 font-semibold min-w-[40px] text-center text-sm">
                {displayQuantity}
              </div>
              <button
                onClick={() => handleQuantityChange(displayQuantity + 1)}
                disabled={displayQuantity >= (selectedStock?.stock || 10)}
                className="p-2 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">
              {isProductInCart ? "Total in cart" : "Total Price"}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {isProductInCart ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />₹
                  {(
                    Number(product.discountedPrice ?? 0) * displayQuantity
                  ).toFixed(2)}
                </span>
              ) : (
                `₹${(Number(product.discountedPrice ?? 0) * quantity).toFixed(
                  2
                )}`
              )}
            </p>
            {isProductInCart && (
              <p className="text-xs text-green-600">
                {displayQuantity} item{displayQuantity > 1 ? "s" : ""} • Size:{" "}
                {cartItem?.stockName}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`
              p-2.5 sm:p-3 rounded-full border transition-all
              ${
                isWishlisted
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-600"
              }
            `}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isWishlisted ? "fill-current" : ""
              }`}
            />
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={
            !hasStock ||
            isActionLoading ||
            cartLoading ||
            (product.productSizes &&
              product.productSizes.length > 0 &&
              !selectedSize)
          }
          className={`
            w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 
            flex items-center justify-center gap-2
            ${
              !hasStock ||
              (product.productSizes &&
                product.productSizes.length > 0 &&
                !selectedSize)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isProductInCart
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white"
            }
          `}
        >
          {cartLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Checking...
            </>
          ) : !hasStock ? (
            <>Out of Stock</>
          ) : product.productSizes &&
            product.productSizes.length > 0 &&
            !selectedSize ? (
            <>Select a Size</>
          ) : isActionLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {isProductInCart ? "Going to Cart..." : "Adding..."}
            </>
          ) : isProductInCart ? (
            <>
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              Go to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
