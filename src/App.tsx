// App.tsx
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { getRoutesByRole } from "./routes/AppRoutes";
import Loading from "./components/common/Loading";

function App() {
  const { authStatus } = useAuth();

  if (!authStatus) return <Loading />;

  const router = createBrowserRouter(
    createRoutesFromElements(getRoutesByRole(authStatus.role))
  );

  return <RouterProvider router={router} />;
}

export default App;
