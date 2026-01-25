import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/productSlice";
import cartReducer from "./features/cartSlice";
import wishlistReducer from "./features/wishlistSlice";
import orderReducer from "./features/orderSlice";
import {
  userReducer,
  profileReducer,
  allUsersReducer,
  userDetailsReducer, // Added
} from "./features/userSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    profile: profileReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer, // Added
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
  },
});
