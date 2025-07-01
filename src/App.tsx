import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import SignIn from "./pages/auth/SignIn";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./components/context/CartContext";

// Define all your types in one place
type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  originalPrice?: number;
};

// Define props types for clarity
type DashboardProps = {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
};

type WishlistProps = {
  wishlist: Product[];
  removeFromWishlist: (id: number) => void;
  addToCart: (product: Product) => void;
};

const App = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Memoize these functions to prevent unnecessary re-renders
  const addToWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  // Added a proper addToCart function for Wishlist
  const addToCart = (product: Product) => {
    // This would normally use your CartContext
    console.log("Adding to cart:", product);
    // In a real app, you would use:
    // const { addToCart } = useCart();
    // addToCart({...product, quantity: 1});
  };

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                wishlist={wishlist}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlist={wishlist}
                removeFromWishlist={removeFromWishlist}
                addToCart={addToCart}
              />
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Add a catch-all route for 404 pages */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;