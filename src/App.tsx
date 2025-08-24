import { useEffect, useMemo } from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { fetchAuth } from "./redux/slice/auth";
import { getRoutesByRole } from "./routes/AppRoutes";
import Loading from "./components/common/Loading";

function App() {
  const dispatch = useAppDispatch();
  const { status, user } = useAppSelector((state) => state.auth);

  const userRole = user?.role || 'guest'; // Default to guest if no role

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAuth());
    }
  }, [status, dispatch]);

  const router = useMemo(() => {
    console.log('Creating router for role:', userRole);
    
    return createBrowserRouter(
      createRoutesFromElements(getRoutesByRole(userRole))
    );
  }, [userRole]);

  if (status === "loading" || status === "idle") {
    return <Loading />;
  }

  if (status === "failed") {
    return <div>Authentication failed. Please try again.</div>;
  }

  // Use key prop to force RouterProvider to completely remount when role changes
  return <RouterProvider key={userRole} router={router} />;
}

export default App;