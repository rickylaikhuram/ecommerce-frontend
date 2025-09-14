// routes/GuestRoutes.tsx
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import SignInOTP from "../pages/auth/SignInOtp";
import CartPage from "../pages/CartPage";
import Wishlist from "../pages/Wishlist";
import Error from "../pages/error";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import ProductsPage from "../pages/Products";
import CategoryPage from "../pages/CategoryPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import PrivacyPolicyPage from "../pages/static/PrivacyPolicyPage";
import ReturnPolicyPage from "../pages/static/ReturnPolicyPage";
import AboutUsPage from "../pages/static/AboutUsPage";
import ShippingPage from "../pages/static/ShippingPage";
import TermsPage from "../pages/static/TermsPage";
import ContactUsPage from "../pages/static/ContactUsPage";

const GuestRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/categories" element={<CategoryPage />} />
    <Route path="/products/:slug" element={<ProductDetails />} />
    <Route path="/search/:slug" element={<ProductDetails />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signinwithotp" element={<SignInOTP />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/return-policy" element={<ReturnPolicyPage />} />
    <Route path="/shipping-info" element={<ShippingPage />} />
    <Route path="/terms-service" element={<TermsPage />} />
    <Route path="/contact-us" element={<ContactUsPage />} />
    <Route path="/about-us" element={<AboutUsPage />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default GuestRoutes;
