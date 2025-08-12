import { useMemo } from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { getRoutesByRole } from "./routes/AppRoutes";
import Loading from "./components/common/Loading";

function App() {
  const { authStatus } = useAuth();

  // Memoize the router to prevent recreation on every render
  const router = useMemo(() => {
    if (!authStatus) return null;
    
    return createBrowserRouter(
      createRoutesFromElements(getRoutesByRole(authStatus.role))
    );
  }, [authStatus?.role]);

  if (!authStatus || !router) return <Loading />;

  return <RouterProvider router={router} />;
}

export default App;