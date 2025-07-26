// routes/AdminRoutes.tsx
import { Route } from "react-router-dom";
import AdminMainLayout from "../layout/AdminMainLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Customers from "../pages/admin/Customer";
import Analytics from "../pages/admin/Analytic";
import Notifications from "../pages/admin/Notification";
import Support from "../pages/admin/Support";
import Settings from "../pages/admin/Setting";
import Error from "../pages/error/index";
import Categories from "../pages/admin/Category";

const AdminRoutes = (
    <Route path="/" element={<AdminMainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
      <Route path="orders" element={<Orders />} />
      <Route path="customers" element={<Customers />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="support" element={<Support />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Error />} />
    </Route>
);

export default AdminRoutes;
