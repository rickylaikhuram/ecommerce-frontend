// routes/UserRoutes.tsx
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home";
import CartPage from "../pages/CartPage";
import Wishlist from "../pages/Wishlist";
import LocationContainer from "../pages/LocationContainer";
import ProductDetails from "../pages/ProductDetails"; // Import your product details component
import Error from "../pages/error";

const UserRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<ProductDetails />} /> {/* Dynamic route with :id parameter */}
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/location" element={<LocationContainer />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;