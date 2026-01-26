import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

const getConfig = (isMultipart = false) => ({
  headers: {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
  },
  withCredentials: true,
});

// 1. GET ALL PRODUCTS (User - Search & Filter)
export const getProducts = createAsyncThunk(
  "products/getAll",
  async (
    {
      keyword = "",
      currentPage = 1,
      price = [0, 25000],
      category,
      ratings = 0,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}`;
      if (price) link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      if (ratings) link += `&ratings[gte]=${ratings}`;
      if (category) link += `&category=${category}`;

      const { data } = await API.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 2. GET PRODUCT DETAILS
export const getProductDetails = createAsyncThunk(
  "product/getDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/v1/product/${id}`);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 3. NEW REVIEW
export const newReview = createAsyncThunk(
  "product/newReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/api/v1/review`, reviewData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 4. GET ADMIN PRODUCTS (Admin Dashboard)
export const getAdminProduct = createAsyncThunk(
  "product/getAdminProduct",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/v1/admin/products", getConfig());
      return data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 5. CREATE PRODUCT (Admin)
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        "/api/v1/admin/product/new",
        productData,
        getConfig(true)
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 6. DELETE PRODUCT (Admin)
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(
        `/api/v1/admin/product/${id}`,
        getConfig()
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 7. UPDATE PRODUCT (Admin)
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/api/v1/admin/product/${id}`,
        productData,
        getConfig(true)
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: {},
    loading: false,
    error: null,
    success: false,
    isDeleted: false,
    isUpdated: false,
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetReviewSuccess: (state) => {
      state.success = false;
    },
    resetProductState: (state) => {
      state.success = false;
      state.isDeleted = false;
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PRODUCTS
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount =
          action.payload.filteredProductsCount;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET DETAILS
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // NEW REVIEW
      .addCase(newReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(newReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(newReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN: GET ALL PRODUCTS
      .addCase(getAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN: CREATE PRODUCT
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN: DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN: UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearErrors,
  resetReviewSuccess,
  resetProductState,
} = productSlice.actions;
export default productSlice.reducer;
