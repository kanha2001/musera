import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Cart Items load from Local Storage
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],

  // Shipping Info load from Local Storage (NEW)
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 1. Add Item to Cart
    addItemToCart: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 2. Remove Item from Cart
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 3. Update Quantity (Increase/Decrease)
    updateCartItemQty: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.product === productId);

      if (item) {
        // Ensure qty is valid and within stock limits
        if (quantity > 0 && quantity <= item.stock) {
          item.quantity = quantity;
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 4. Save Shipping Information (NEW)
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },

    // 5. Clear Cart
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
  saveShippingInfo, // <-- Yeh export zaroori hai Shipping Page ke liye
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
