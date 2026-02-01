// src/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// --- HELPERS ---
const getConfig = (isMultipart = false) => ({
  headers: {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
  },
  withCredentials: true,
});

// 1. REGISTER
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        "/api/v1/register",
        userData,
        getConfig(true)
      );
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration Failed"
      );
    }
  }
);

// 2. LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        "/api/v1/login",
        { email, password },
        getConfig()
      );
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login Failed");
    }
  }
);

// 3. LOAD USER
export const loadUser = createAsyncThunk(
  "user/load",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/v1/me", getConfig());
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Load User Failed"
      );
    }
  }
);

// 4. LOGOUT
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.get("/api/v1/logout", { withCredentials: true });
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout Failed"
      );
    }
  }
);

// 5. UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        "/api/v1/me/update",
        userData,
        getConfig(true)
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update Failed");
    }
  }
);

// 6. UPDATE PASSWORD
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        "/api/v1/password/update",
        passwords,
        getConfig()
      );
      return data.success;
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Server not responding or Network Error";
      return rejectWithValue(message);
    }
  }
);

// 7. FORGOT PASSWORD
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        "/api/v1/password/forgot",
        { email },
        getConfig()
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Request Failed");
    }
  }
);

// 8. RESET PASSWORD
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, passwords }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/api/v1/password/reset/${token}`,
        passwords,
        getConfig()
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Reset Failed");
    }
  }
);

// 9. MY ORDERS
export const myOrders = createAsyncThunk(
  "user/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/v1/orders/me", getConfig());
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch Orders Failed"
      );
    }
  }
);

// 10. ORDER DETAILS
export const getOrderDetails = createAsyncThunk(
  "user/orderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/v1/order/${id}`, getConfig());
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch Order Details Failed"
      );
    }
  }
);

// --- ADMIN ACTIONS ---

// 11. GET ALL USERS
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/v1/admin/users", getConfig());
      return data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch Failed");
    }
  }
);

// 12. DELETE USER
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(
        `/api/v1/admin/user/${id}`,
        getConfig()
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete Failed");
    }
  }
);

// 13. GET USER DETAILS (Admin)
export const getUserDetails = createAsyncThunk(
  "admin/getUserDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/v1/admin/user/${id}`, getConfig());
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch Failed");
    }
  }
);

// 14. UPDATE USER (Admin)
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const dataObj = {};
      userData.forEach((value, key) => (dataObj[key] = value));

      const { data } = await API.put(
        `/api/v1/admin/user/${id}`,
        dataObj,
        config
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update Failed");
    }
  }
);

// ---------------- SLICES ----------------

// 1. MAIN USER SLICE
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {},
    isAuthenticated: !!localStorage.getItem("user"),
    loading: false,
    error: null,
    message: null,
    success: false,
    isUpdated: false,
    orders: [],
    orderDetails: {},
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.success = false;
    },
    resetUpdate: (state) => {
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        if (!state.isAuthenticated) state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        localStorage.removeItem("user");
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.message = "Profile Updated Successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PASSWORD
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.message = "Password Updated Successfully";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ORDERS
      .addCase(myOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ORDER DETAILS
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 2. PROFILE SLICE
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    isUpdated: false,
    isDeleted: false,
    message: null,
    error: null,
  },
  reducers: {
    resetProfile: (state) => {
      state.isUpdated = false;
      state.isDeleted = false;
      state.message = null;
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 3. ALL USERS SLICE
const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 4. USER DETAILS SLICE
const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    user: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// EXPORT ACTIONS
export const { clearErrors, clearMessage, resetUpdate } = userSlice.actions;
export const { resetProfile } = profileSlice.actions;
export const { clearErrors: clearAllUsersErrors } = allUsersSlice.actions;
export const { clearErrors: clearUserDetailsErrors } = userDetailsSlice.actions;

// EXPORT REDUCERS
export const userReducer = userSlice.reducer;
export const profileReducer = profileSlice.reducer;
export const allUsersReducer = allUsersSlice.reducer;
export const userDetailsReducer = userDetailsSlice.reducer;
