// routes/UserRoutes.tsx
import { Navigate, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AccountLayout from "../components/client/AccountLayout";
import Home from "../pages/home";
import CartPage from "../pages/CartPage";
import LocationContainer from "../pages/LocationContainer";
import ProductDetails from "../pages/ProductDetails";
import Error from "../pages/Error";
import Wishlist from "../pages/Wishlist";
import UserDetails from "../pages/client/UserDetails";
import UserAddress from "../pages/client/UserAddress";
import UserOrder from "../pages/client/UserOrder";
import UserSecurity from "../pages/client/UserSecurity";
import Checkout from "../pages/Checkout";
import ProductsPage from "../pages/Products";
import OrderDetails from "../pages/client/OrderDetails";
import OrderConfirmation from "../pages/client/OrderConfirmation";

const UserRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />

    {/* Account Routes - Nested properly */}
    <Route path="/account" element={<AccountLayout />}>
      <Route index element={<UserDetails />} />
      <Route path="profile" element={<UserDetails />} />
      <Route path="addresses" element={<UserAddress />} />
      <Route path="orders" element={<UserOrder />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="security" element={<UserSecurity />} />
    </Route>

    {/* Other Routes */}
    <Route path="orders/:id" element={<OrderDetails />} />
    <Route path="orders/confirmed/:id" element={<OrderConfirmation />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/search" element={<ProductsPage />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/location" element={<LocationContainer />} />
    <Route path="/checkout" element={<Checkout />} />

    {/* Routes to Navigate to home */}
    <Route path="/signin" element={<Navigate to="/" replace />} />
    <Route path="/signinwithotp" element={<Navigate to="/" replace />} />
    <Route path="/signup" element={<Navigate to="/" replace />} />
    <Route path="/forgot-password" element={<Navigate to="/" replace />} />
    
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;
