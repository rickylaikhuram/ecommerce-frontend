// routes/UserRoutes.tsx
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home";
import Error from "../pages/Error";

const UserRoutes = (
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;
