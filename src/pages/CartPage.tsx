import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../components/context/CartContext";
import { useNavigate } from "react-router-dom";

// Sample related products (to be replaced with real logic or API)
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
];

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-[#EAEDED] min-h-screen pt-6 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Home
          </span>
          <svg
            className="w-3 h-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-500 font-semibold">Cart</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 bg-white p-6 rounded-md shadow">
            <h2 className="text-2xl font-bold border-b pb-4 mb-4">Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ₹{item.price.toFixed(2)} per item
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="border border-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-100"
                        >
                          <FaMinus />
                        </button>
                        <span className="text-md font-medium px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="border border-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-100"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-black hover:text-red-600"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right text-lg font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-md shadow h-fit">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>

            <div className="flex justify-between text-sm mb-2">
              <span>Total Items:</span>
              <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={clearCart}
              className="w-full bg-neutral-800 text-white font-semibold py-2 rounded text-sm hover:bg-black mb-3"
            >
              🗑️ Clear Cart
            </button>

            <button className="w-full bg-yellow-500 text-black font-semibold py-2 rounded text-sm hover:bg-yellow-600">
              Proceed to Buy ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </button>
          </div>
        </div>

        {/* Recommended Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4 text-gray-900">You may also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h4 className="font-semibold text-sm mb-1 truncate">
                    {product.name}
                  </h4>
                  <p className="text-gray-700 text-sm">
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