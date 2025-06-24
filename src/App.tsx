import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist.tsx';

// Define the Product type
type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  originalPrice?: number;
};

const App = () => {
  // State for wishlist
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Function to add product to wishlist
  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      // Check if product already exists in wishlist
      if (!prev.some(item => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  // Function to remove product from wishlist
  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <div>
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
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;