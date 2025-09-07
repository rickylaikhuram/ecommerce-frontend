import { configureStore } from "@reduxjs/toolkit";
import Auth from "./slice/auth";
import UserProfile from "./slice/userProfile";
import Cart from "./slice/cart";
import Wishlist from "./slice/wishlist";
import Categories from "./slice/categories";
import Delivery from "./slice/delivery";
import Address from "./slice/address";

export const store = configureStore({
  reducer: {
    auth: Auth,
    address: Address,
    cart: Cart,
    categories: Categories,
    delivery: Delivery,
    user: UserProfile,
    wishlist: Wishlist,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
