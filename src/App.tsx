import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import axios from "./utils/axios";
import "./index.css";
import { getRoutesByRole } from "./routes/AppRoutes";
import Loading from "./components/common/Loading";

interface AuthStatus {
  role: "user" | "admin" | "guest";
}

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/me", {
          withCredentials: true, 
        });
        setAuthStatus(response.data.user);
      } catch (error) {
        console.error("Error fetching authentication status:", error);
        setAuthStatus({ role: "guest" }); 
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) return <Loading />;
console.log(authStatus?.role)
  const router = createBrowserRouter(
    createRoutesFromElements(getRoutesByRole(authStatus?.role))
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
