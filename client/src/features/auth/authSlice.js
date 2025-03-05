import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, updateUserProfile } from "./authService";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/me");
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Authentication failed" }
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const response = await updateUserProfile(userData);
      return response.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to update profile" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    endLoading: (state) => {
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Authentication failed";
        state.user = null;
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to update profile";
      });
  },
});

export const { setUser, logout, startLoading, endLoading } = authSlice.actions;
export default authSlice.reducer;
