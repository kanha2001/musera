// src/features/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// 1. Toggle Wishlist (Add/Remove)
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/v1/wishlist", productData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 2. Get My Wishlist
export const getMyWishlist = createAsyncThunk(
  "wishlist/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/v1/wishlist", {
        withCredentials: true,
      });
      return data.wishlist; // array of products
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearWishlistErrors: (state) => {
      state.error = null;
    },
    clearWishlistMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle Wishlist
      .addCase(toggleWishlist.pending, () => {
        // background update; loading nahi dikhate
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Get Wishlist
      .addCase(getMyWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(getMyWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistErrors, clearWishlistMessage } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
