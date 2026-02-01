// features/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // payload: {product, name, price, image, size, quantity, stock}
    addItemToCart: (state, action) => {
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product && i.size === item.size
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === item.product && i.size === item.size ? item : i
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // payload: { productId, size }
    removeItemFromCart: (state, action) => {
      const { productId, size } = action.payload;

      state.cartItems = state.cartItems.filter((i) => {
        if (size) return !(i.product === productId && i.size === size);
        return i.product !== productId;
      });

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // payload: { productId, size, quantity }
    updateCartItemQty: (state, action) => {
      const { productId, size, quantity } = action.payload;
      const item = state.cartItems.find(
        (i) => i.product === productId && i.size === size
      );

      if (item) {
        // stock property frontend se aya hua hai
        if (quantity > 0 && (!item.stock || quantity <= item.stock)) {
          item.quantity = quantity;
        }
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQty,
  saveShippingInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
