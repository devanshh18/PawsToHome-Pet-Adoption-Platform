import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingShelters: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setPendingShelters: (state, action) => {
      state.pendingShelters = action.payload;
      state.isLoading = false;
    },
    startLoading: (state) => {
      // Add this reducer
      state.isLoading = true;
    },
    endLoading: (state) => {
      // Add this reducer
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setPendingShelters, startLoading, endLoading, setError } =
  adminSlice.actions;
export default adminSlice.reducer;