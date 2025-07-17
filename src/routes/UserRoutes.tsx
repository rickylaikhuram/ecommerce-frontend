// routes/UserRoutes.tsx
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home";
import Error from "../pages/Error";
import CartPage from "../pages/CartPage";
import Wishlist from "../pages/Wishlist";
import LocationContainer from "../pages/LocationContainer";

const UserRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<Wishlist />} /> {/* Use container here */}
    <Route path="/location" element={<LocationContainer />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;