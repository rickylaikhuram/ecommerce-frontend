import GuestRoutes from "./GuestRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

export const getRoutesByRole = (role?: string) => {
  if (role === "admin") return AdminRoutes;
  if (role === "user") return UserRoutes;
  return GuestRoutes;
};
