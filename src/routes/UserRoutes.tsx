// routes/UserRoutes.tsx
import { Navigate, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AccountLayout from "../components/client/AccountLayout";
import Home from "../pages/home";
import CartPage from "../pages/CartPage";
import ProductDetails from "../pages/ProductDetails";
import Error from "../pages/error";
import Wishlist from "../pages/Wishlist";
import UserDetails from "../pages/client/UserDetails";
import UserAddress from "../pages/client/UserAddress";
import UserOrder from "../pages/client/UserOrder";
import UserSecurity from "../pages/client/UserSecurity";
import Checkout from "../pages/Checkout";
import ProductsPage from "../pages/Products";
import OrderDetails from "../pages/client/OrderDetails";
import OrderConfirmation from "../pages/client/OrderConfirmation";
import CategoryPage from "../pages/CategoryPage";
import PrivacyPolicyPage from "../pages/static/PrivacyPolicyPage";
import ReturnPolicyPage from "../pages/static/ReturnPolicyPage";
import AboutUsPage from "../pages/static/AboutUsPage";
import ShippingPage from "../pages/static/ShippingPage";
import TermsPage from "../pages/static/TermsPage";
import ContactUsPage from "../pages/static/ContactUsPage";

const UserRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />

    {/* Account Routes - Nested properly */}
    <Route path="/account" element={<AccountLayout />}>
      {/* Show account home/welcome message on desktop, sidebar menu on mobile */}
      <Route index element={<UserDetails />} />
      <Route path="profile" element={<UserDetails />} />
      <Route path="addresses" element={<UserAddress />} />
      <Route path="orders" element={<UserOrder />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="security" element={<UserSecurity />} />
    </Route>

    {/* Other Routes */}
    <Route path="orders/:id" element={<OrderDetails />} />
    <Route path="orders-success/:id" element={<OrderConfirmation />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/search" element={<ProductsPage />} />
    <Route path="/categories" element={<CategoryPage />} />
    <Route path="/products/:slug" element={<ProductDetails />} />
    <Route path="/search/:slug" element={<ProductDetails />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/checkout" element={<Checkout />} />

    {/* Static Routes */}
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/return-policy" element={<ReturnPolicyPage />} />
    <Route path="/shipping-info" element={<ShippingPage />} />
    <Route path="/terms-service" element={<TermsPage />} />
    <Route path="/contact-us" element={<ContactUsPage />} />
    <Route path="/about-us" element={<AboutUsPage />} />
    {/* Routes to Navigate to home */}
    <Route path="/signin" element={<Navigate to="/" replace />} />
    <Route path="/signinwithotp" element={<Navigate to="/" replace />} />
    <Route path="/signup" element={<Navigate to="/" replace />} />
    <Route path="/forgot-password" element={<Navigate to="/" replace />} />

    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;
