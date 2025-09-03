import { useEffect, useMemo } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { fetchAuth } from "./redux/slice/auth";
import { getRoutesByRole } from "./routes/AppRoutes";
import Loading from "./components/common/Loading";
import { fetchCategories } from "./redux/slice/categories";
import { fetchCart } from "./redux/slice/cart";

function App() {
  const dispatch = useAppDispatch();

  // Auth
  const { status: authStatus, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (authStatus === "idle") {
      dispatch(fetchAuth());
    }
  }, [authStatus, dispatch]);

  // Categories
  const categoriesStatus = useAppSelector((state) => state.categories.status);
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  // Cart
  const cartStatus = useAppSelector((state) => state.cart.status);
  useEffect(() => {
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [cartStatus, dispatch]);

  const userRole = user?.role || "guest";

  const router = useMemo(() => {

    return createBrowserRouter(
      createRoutesFromElements(getRoutesByRole(userRole))
    );
  }, [userRole]);

  if (authStatus === "loading" || authStatus === "idle") {
    return <Loading />;
  }

  if (authStatus === "failed") {
    return <div>Authentication failed. Please try again.</div>;
  }

  return <RouterProvider key={userRole} router={router} />;
}

export default App;
