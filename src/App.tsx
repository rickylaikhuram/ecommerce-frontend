import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import CartPage from "./pages/CartPage"; // ✅ correct
import { CartProvider } from "./components/context/CartContext";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  originalPrice?: number;
};

const App = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
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
                addToCart={addToWishlist}
              />
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
