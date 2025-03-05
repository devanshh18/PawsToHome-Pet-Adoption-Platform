import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  submitAdoptionApplication,
  getShelterApplications,
  updateApplicationStatus,
  getUserApplications,
} from "./adoptionServices.js";

const initialState = {
  applications: [],
  userApplications: [],
  isLoading: false,
  error: null,
  success: false,
};

export const submitApplication = createAsyncThunk(
  "adoption/submit",
  async (applicationData, thunkAPI) => {
    try {
      return await submitAdoptionApplication(applicationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchShelterApplications = createAsyncThunk(
  "adoption/getShelterApplications",
  async (_, thunkAPI) => {
    try {
      return await getShelterApplications();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  "adoption/getUserApplications",
  async (_, thunkAPI) => {
    try {
      return await getUserApplications();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

export const updateApplication = createAsyncThunk(
  "adoption/updateStatus",
  async ({ id, statusData }, thunkAPI) => {
    try {
      return await updateApplicationStatus(id, statusData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const adoptionSlice = createSlice({
  name: "adoption",
  initialState,
  reducers: {
    resetAdoptionState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Application
      .addCase(submitApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Shelter Applications
      .addCase(fetchShelterApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShelterApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.applications;
      })
      .addCase(fetchShelterApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userApplications = action.payload.applications;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Update Applications
      .addCase(updateApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const index = state.applications.findIndex(
          (app) => app._id === action.payload.application._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAdoptionState } = adoptionSlice.actions;
export default adoptionSlice.reducer;
