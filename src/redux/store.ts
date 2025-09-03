import { configureStore } from "@reduxjs/toolkit";
import Auth from "./slice/auth";
import UserProfile from "./slice/userProfile";
import Cart from "./slice/cart";
import Wishlist from "./slice/wishlist";
import Categories from "./slice/categories";
import Delivery from "./slice/delivery";

export const store = configureStore({
  reducer: {
    auth: Auth,
    user: UserProfile,
    cart: Cart,
    wishlist: Wishlist,
    categories: Categories,
    delivery: Delivery,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
