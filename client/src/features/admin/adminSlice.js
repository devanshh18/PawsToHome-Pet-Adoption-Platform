import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService.js";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  adminStats: null,
  users: [],
  shelters: [],
  pendingShelters: [],
  systemHealth: null,
  systemHistory: [],
  insights: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: ""
};

// Get admin dashboard statistics
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAdminStats();
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to load dashboard statistics";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllUsers();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load users";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all shelters
export const fetchAllShelters = createAsyncThunk(
  "admin/fetchShelters",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllShelters();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load shelters";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get pending shelters
export const fetchPendingShelters = createAsyncThunk(
  "admin/fetchPendingShelters",
  async (_, thunkAPI) => {
    try {
      return await adminService.getPendingShelters();
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to load pending shelter registrations";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Approve shelter
export const approveShelterRegistration = createAsyncThunk(
  "admin/approveShelter",
  async (id, thunkAPI) => {
    try {
      return await adminService.approveShelter(id);
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to approve shelter";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reject shelter
export const rejectShelterRegistration = createAsyncThunk(
  "admin/rejectShelter",
  async ({ id, reason }, thunkAPI) => {
    try {
      return await adminService.rejectShelter(id, reason);
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to reject shelter";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user
export const removeUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      return await adminService.deleteUser(id);
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to delete user";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete shelter
export const removeShelter = createAsyncThunk(
  "admin/deleteShelter",
  async (id, thunkAPI) => {
    try {
      return await adminService.deleteShelter(id);
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to delete shelter";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get system health data
export const fetchSystemHealth = createAsyncThunk(
  "admin/fetchSystemHealth",
  async (_, thunkAPI) => {
    try {
      return await adminService.getSystemHealth();
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to load system health data";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get system history data
export const fetchSystemHistory = createAsyncThunk(
  "admin/fetchSystemHistory",
  async (period, thunkAPI) => {
    try {
      return await adminService.getSystemHistory(period);
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to load system history data";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get insights data
export const fetchInsights = createAsyncThunk(
  "admin/fetchInsights",
  async (timeRange, thunkAPI) => {
    try {
      return await adminService.getInsights(timeRange);
    } catch (error) {
      const message = error.response?.data?.message || 
                     "Failed to load insights data";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminStats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Shelters
      .addCase(fetchAllShelters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllShelters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shelters = action.payload.shelters;
      })
      .addCase(fetchAllShelters.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Pending Shelters
      .addCase(fetchPendingShelters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingShelters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingShelters = action.payload.shelters;
      })
      .addCase(fetchPendingShelters.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Approve Shelter
      .addCase(approveShelterRegistration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveShelterRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pendingShelters = state.pendingShelters.filter(
          (shelter) => shelter._id !== action.payload.shelter._id
        );
        toast.success("Shelter approved successfully");
      })
      .addCase(approveShelterRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Reject Shelter
      .addCase(rejectShelterRegistration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectShelterRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pendingShelters = state.pendingShelters.filter(
          (shelter) => shelter._id !== action.payload.shelter._id
        );
        toast.success("Shelter rejected successfully");
      })
      .addCase(rejectShelterRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Delete User
      .addCase(removeUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter(
          (user) => user._id !== action.meta.arg
        );
        toast.success("User deleted successfully");
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Delete Shelter
      .addCase(removeShelter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeShelter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shelters = state.shelters.filter(
          (shelter) => shelter._id !== action.meta.arg
        );
        toast.success("Shelter deleted successfully");
      })
      .addCase(removeShelter.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // System Health
      .addCase(fetchSystemHealth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.systemHealth = action.payload;
      })
      .addCase(fetchSystemHealth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // System History
      .addCase(fetchSystemHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSystemHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.systemHistory = action.payload.history;
      })
      .addCase(fetchSystemHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      })
      
      // Insights
      .addCase(fetchInsights.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;