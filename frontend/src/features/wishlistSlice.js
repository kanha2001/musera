import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Toggle Wishlist (Add/Remove)
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      // productData = { productId, name, price, image }
      const { data } = await axios.post(
        "/api/v1/wishlist",
        productData,
        config
      );
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
      const { data } = await axios.get("/api/v1/wishlist");
      return data.wishlist; // Yeh array hoga jisme stock bhi hai
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [], // Isme products rahenge
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
      // --- Toggle Case ---
      .addCase(toggleWishlist.pending, (state) => {
        // Note: Hum loading true nahi karte taaki UI flicker na kare
        // User ko background me hone do
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.message = action.payload.message;

        // Agar backend ne updated list bheji hai (jo humne controller me kiya tha)
        // to usse update kar lo.
        if (action.payload.wishlist && action.payload.wishlist.products) {
          // Controller ne raw DB object bheja hai, usme stock nahi hoga
          // Isliye behtar hai hum bas message dikhayein aur phir 'getMyWishlist' call karein UI refresh ke liye
          // Lekin instant UI update ke liye hum manual logic bhi laga sakte hain.
          // Abhi ke liye simple rakhte hain:
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // --- Get Wishlist Case ---
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
