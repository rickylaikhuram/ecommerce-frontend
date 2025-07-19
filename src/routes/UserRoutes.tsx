// routes/UserRoutes.tsx
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AccountLayout from '../components/client/AccountLayout';
import Home from "../pages/home";
import CartPage from "../pages/CartPage";
import LocationContainer from "../pages/LocationContainer";
import ProductDetails from "../pages/ProductDetails";
import Error from "../pages/error";
import Wishlist from "../pages/Wishlist";
import UserDetails from "../pages/client/UserDetails";
import UserAddress from "../pages/client/UserAddress";
import UserOrder from "../pages/client/UserOrder";
import UserSecurity from "../pages/client/UserSecurity";

const UserRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    
    {/* Account Routes - Nested properly */}
    <Route path="/account" element={<AccountLayout />}>
      <Route index element={<UserDetails />} />
      <Route path="profile" element={<UserDetails />} />
      <Route path="addresses" element={<UserAddress />} />
      <Route path="orders" element={<UserOrder />} />
      {/* <Route path="returns" element={<Returns />} /> */}
      <Route path="wishlist" element={<Wishlist />} />
      {/* <Route path="payment-methods" element={<PaymentMethods />} /> */}
      {/* <Route path="wallet" element={<Wallet />} /> */}
      {/* <Route path="notifications" element={<Notifications />} /> */}
      <Route path="security" element={<UserSecurity />} />
    </Route>

    {/* Other Routes */}
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/location" element={<LocationContainer />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;