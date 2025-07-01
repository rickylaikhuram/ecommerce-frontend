import { FaTrash, FaPlus, FaMinus, FaHeart, FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../components/context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const relatedProducts = [
  {
    id: 101,
    name: "Premium Cotton Hoodie",
    price: 34.99,
    image: "/images/hoodie.jpg",
  },
  {
    id: 102,
    name: "Classic Sneakers",
    price: 49.99,
    image: "/images/sneakers.jpg",
  },
  {
    id: 103,
    name: "Stylish Jeans",
    price: 39.99,
    image: "/images/jeans.jpg",
  },
  {
    id: 104,
    name: "Wireless Headphones",
    price: 59.99,
    image: "/images/headphones.jpg",
  },
  {
    id: 105,
    name: "Leather Wallet",
    price: 29.99,
    image: "/images/wallet.jpg",
  },
];

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    addToCart,
  } = useCart();

  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate total number of items in cart (sum of all quantities)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddRecommendedItems = () => {
    relatedProducts.forEach(product => {
      if (!cartItems.some(item => item.id === product.id)) {
        addToCart({...product, quantity: 1});
      }
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / 280);
      setCurrentSlide(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
          <div className="flex justify-around items-center py-3">
            <button 
              onClick={() => navigate("/")}
              className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaHome className="text-xl" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => navigate("/wishlist")}
              className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaHeart className="text-xl" />
              <span className="text-xs mt-1">Wishlist</span>
            </button>
            <button 
              onClick={() => navigate("/cart")}
              className="flex flex-col items-center text-blue-600 relative"
            >
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">Cart</span>
            </button>
            <button 
              onClick={() => navigate("/signin")}
              className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaUser className="text-xl" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>

        {/* Rest of your cart page content remains exactly the same */}
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button 
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
              >
                Home
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 font-medium">Shopping Cart</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Shopping Cart ({cartItems.length})
              </h2>

              {cartItems.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
                  <button 
                    onClick={() => navigate("/")}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-8 rounded-lg text-base transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row py-6 gap-6 group"
                    >
                      <div 
                        className="w-28 h-28 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer transition-transform hover:scale-105"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 
                            className="font-medium text-gray-900 text-lg mb-1 hover:text-blue-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                          <div className="flex items-center gap-4">
                            <div className="border border-gray-200 rounded-lg flex items-center bg-gray-50">
                              <button
                                onClick={() => decrementQuantity(item.id)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <FaMinus size={14} />
                              </button>
                              <span className="px-4 border-x border-gray-200 text-base font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => incrementQuantity(item.id)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <FaPlus size={14} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                            >
                              <FaTrash className="text-base" />
                              <span className="text-sm font-medium">Remove</span>
                            </button>
                          </div>

                          <div className="font-bold text-lg text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-right">
                <p className="text-xl font-medium">
                  Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items):{" "}
                  <span className="font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-96">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <p className="text-xl font-medium mb-6">
                  Order Summary
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                    <span>Total:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 rounded-lg shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>
              </div>

              {/* Recommended Products - Mobile Carousel */}
              <div className="lg:hidden bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <h3 className="text-xl font-medium mb-4 text-gray-900">
                  Frequently bought together
                </h3>
                
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto scroll-smooth pb-4 gap-4 scrollbar-hide touch-pan-x"
                >
                  {relatedProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-4"
                    >
                      <div 
                        className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer mb-3"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h4 
                        className="font-medium text-gray-900 mb-1 cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h4>
                      <p className="text-gray-700 font-medium">₹{product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-4 space-x-2">
                  {relatedProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (scrollRef.current) {
                          scrollRef.current.scrollTo({
                            left: index * 280,
                            behavior: "smooth"
                          });
                        }
                        setCurrentSlide(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? "bg-gray-800" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Recommended Products - Desktop */}
              <div className="hidden lg:block bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-medium mb-4 text-gray-900">
                  Frequently bought together
                </h3>
                <div className="space-y-4 mb-4">
                  {relatedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div 
                        className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p 
                          className="font-medium text-gray-900 line-clamp-2 cursor-pointer"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </p>
                        <p className="text-gray-700 font-medium">₹{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleAddRecommendedItems}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Add all to cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* More Recommendations - Mobile Carousel */}
        {relatedProducts.length > 0 && (
          <div className="lg:hidden mt-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Recommended for you
            </h3>
            
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth pb-4 gap-4 scrollbar-hide touch-pan-x"
            >
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h4 className="font-medium text-gray-900 text-base mb-1 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-gray-700 font-bold">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {relatedProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        left: index * 280,
                        behavior: "smooth"
                      });
                    }
                    setCurrentSlide(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? "bg-gray-800" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* More Recommendations - Desktop */}
        {relatedProducts.length > 0 && (
          <div className="hidden lg:block mt-12">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">
              Recommended for you
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="font-medium text-gray-900 text-lg mb-1 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-gray-700 font-bold">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;