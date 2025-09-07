// routes/AdminRoutes.tsx
import { Navigate, Route } from "react-router-dom";
import AdminMainLayout from "../layout/AdminMainLayout";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
// import Analytics from "../pages/admin/Analytic";
import Dashboard from "../pages/admin/Dashboard";
import Error from "../pages/error";
import Categories from "../pages/admin/Category";
import Customers from "../pages/admin/Customer";
import PriceSetting from "../pages/admin/PriceSetting";
import Banners from "../pages/admin/Banner";

const AdminRoutes = (
  <Route path="/" element={<AdminMainLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="categories" element={<Categories />} />
    <Route path="orders" element={<Orders />} />
    <Route path="customers" element={<Customers />} />
    <Route path="pricesetting" element={<PriceSetting />} />
    <Route path="banner" element={<Banners />} />
    {/*<Route path="analytics" element={<Analytics />} />
      <Route path="support" element={<Support />} />
      <Route path="settings" element={<Settings />} /> */}
    <Route path="*" element={<Error />} />
    {/* Routes to Navigate to home */}
    <Route path="/signin" element={<Navigate to="/" replace />} />
    <Route path="/signinwithotp" element={<Navigate to="/" replace />} />
    <Route path="/signup" element={<Navigate to="/" replace />} />
    <Route path="/forgot-password" element={<Navigate to="/" replace />} />
  </Route>
);

export default AdminRoutes;
