// routes/GuestRoutes.tsx
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import SignInOTP from "../pages/auth/SignInOtp";
import CartPage from "../pages/CartPage";
import Wishlist from "../pages/Wishlist";
import Error from "../pages/error/index";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import ProductsPage from "../pages/Products";

const GuestRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<Checkout/>} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signinwithotp" element={<SignInOTP />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default GuestRoutes;
