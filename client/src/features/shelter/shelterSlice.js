import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllShelters, getShelterById } from "./shelterService";

const initialState = {
  shelters: [],
  selectedShelter: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalShelters: 0,
  },
};

// Async thunk for fetching all shelters
export const fetchShelters = createAsyncThunk(
  "shelters/fetchAll",
  async (filters, thunkAPI) => {
    try {
      return await getAllShelters(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a specific shelter
export const fetchShelterById = createAsyncThunk(
  "shelters/fetchById",
  async (id, thunkAPI) => {
    try {
      return await getShelterById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const shelterSlice = createSlice({
  name: "shelters",
  initialState,
  reducers: {
    clearSelectedShelter: (state) => {
      state.selectedShelter = null;
    },
    resetShelterError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchShelters
      .addCase(fetchShelters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShelters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shelters = action.payload.shelters;
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.pagination.currentPage,
            totalPages: action.payload.pagination.totalPages,
            totalShelters: action.payload.pagination.totalCount,
          };
        }
      })
      .addCase(fetchShelters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handle fetchShelterById
      .addCase(fetchShelterById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShelterById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedShelter = action.payload.shelter;
      })
      .addCase(fetchShelterById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedShelter, resetShelterError } = shelterSlice.actions;
export default shelterSlice.reducer;