import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import type { Product } from "../types/products.types";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Minus,
  Plus,
  Package,
  Clock,
  MapPin,
} from "lucide-react";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "shipping" | "returns"
  >("description");

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkCartStatus();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`api/product/${id}`);

      const sortedImages = [...response.data.product.images].sort(
        (a, b) => a.position - b.position
      );

      setProduct({
        ...response.data.product,
        images: sortedImages,
      });

      setError(null);
    } catch (err) {
      setError("Failed to load product details");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkCartStatus = async () => {
    try {
      const cartResponse = await instance.get("/cart");
      const cartItems = cartResponse.data.items || [];
      const productInCart = cartItems.some(
        (item: any) => item.productId === id
      );
      setIsInCart(productInCart);
    } catch (err) {
      console.error("Error checking cart status:", err);
    }
  };

  const handleAddToCart = async () => {
    if (
      !selectedSize &&
      product?.productSizes &&
      product.productSizes.length > 0
    ) {
      alert("Please select a size");
      return;
    }

    try {
      await instance.post("/cart/add", {
        productId: id,
        size: selectedSize,
        quantity: quantity,
      });
      setIsInCart(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart");
    }
  };

  const calculateDiscount = () => {
    if (!product || !product.price || !product.fakePrice) return 0;
    if (product.fakePrice <= product.price) return 0;
    return Math.round(
      ((product.fakePrice - product.price) / product.fakePrice) * 100
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">
              {product.category?.name || "Products"}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
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
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{discount}%
                      </div>
                    )}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all group"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all group"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden 
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
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category?.name || "Uncategorized"}
                </span>
                {product.totalSales > 50 && (
                  <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    🔥 Best Seller
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name || "Unnamed Product"}
              </h1>

              <div className="flex items-center gap-4 text-sm">
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
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₹{Number(product.price ?? 0).toFixed(2)}
                </span>
                {product.fakePrice &&
                  product.fakePrice > (product.price || 0) && (
                    <>
                      <span className="text-xl sm:text-2xl text-gray-400 line-through">
                        ₹{Number(product.fakePrice).toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        Save ₹
                        {(product.fakePrice - (product.price || 0)).toFixed(2)}
                      </span>
                    </>
                  )}
              </div>
            </div>

            {/* Size Selection */}
            {product.productSizes && product.productSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Select Size</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 underline">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.productSizes.map((size) => (
                    <button
                      key={size.stockName}
                      onClick={() => setSelectedSize(size.stockName)}
                      disabled={size.stock === 0}
                      className={`
                        relative py-3 px-4 rounded-lg font-medium transition-all duration-200
                        ${
                          selectedSize === size.stockName
                            ? "bg-gray-900 text-white shadow-lg transform scale-105"
                            : size.stock === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-700"
                        }
                      `}
                    >
                      <span>{size.stockName}</span>
                      {size.stock === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100/90">
                          <span className="text-xs font-normal">
                            Out of stock
                          </span>
                        </div>
                      )}
                      {size.stock > 0 && size.stock <= 5 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {size.stock}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {selectedSize && product.productSizes && (
                  <span className="text-sm text-gray-600">
                    {(() => {
                      const selectedStock = product.productSizes.find(
                        (s) => s.stockName === selectedSize
                      );
                      if (selectedStock && selectedStock.stock > 0) {
                        return `${selectedStock.stock} available`;
                      }
                      return "";
                    })()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={isInCart ? () => navigate("/cart") : handleAddToCart}
                disabled={!hasStock}
                className={`
                  flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 
                  flex items-center justify-center gap-2 transform hover:scale-[1.02]
                  ${
                    !hasStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isInCart
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      : "bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                  }
                `}
              >
                {!hasStock ? (
                  <>Out of Stock</>
                ) : isInCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    View in Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105
                  ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                  }
                `}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
              <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-all duration-200 transform hover:scale-105 bg-white">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Truck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-600">Orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-600">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <RotateCcw className="w-6 h-6 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Easy Returns
                  </p>
                  <p className="text-xs text-gray-600">30 Day Policy</p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Estimated Delivery</p>
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
        <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {(["description", "shipping", "returns"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-6 py-4 font-medium capitalize whitespace-nowrap transition-all
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

          <div className="p-6 lg:p-8">
            {activeTab === "description" && (
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Standard Shipping
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        5-7 business days • Free on orders over $50
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Express Shipping
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        2-3 business days • $15.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Next Day Delivery
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Order before 2PM • $25.00
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Delivery times may vary during peak
                    seasons. International shipping available for select
                    countries.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "returns" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Return Policy
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      30-Day Return Guarantee
                    </h4>
                    <p className="text-gray-600">
                      We want you to be completely satisfied with your purchase.
                      If you're not happy with your order, you can return it
                      within 30 days of delivery for a full refund.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Return Conditions
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        Items must be unused and in original packaging
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        Include all tags and accessories
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        Provide proof of purchase
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      How to Return
                    </h4>
                    <ol className="space-y-2 text-gray-600">
                      <li>1. Contact our customer service team</li>
                      <li>2. Receive your return authorization number</li>
                      <li>3. Pack items securely with return form</li>
                      <li>4. Ship to our returns center</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white rounded-full shadow-md">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="text-xl font-bold text-gray-900">
              ${(Number(product.price ?? 0) * quantity).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`
              p-3 rounded-full border transition-all
              ${
                isWishlisted
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-600"
              }
            `}
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>
        <button
          onClick={isInCart ? () => navigate("/cart") : handleAddToCart}
          disabled={!hasStock}
          className={`
            w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 
            flex items-center justify-center gap-2
            ${
              !hasStock
                ? "bg-gray-200 text-gray-400"
                : isInCart
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-white"
            }
          `}
        >
          {!hasStock ? (
            <>Out of Stock</>
          ) : isInCart ? (
            <>
              <Check className="w-5 h-5" />
              View in Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
