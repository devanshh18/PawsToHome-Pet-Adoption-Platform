import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addPet,
  getShelterPets,
  updatePet,
  deletePet,
} from "./petService";

export const addNewPet = createAsyncThunk(
  "pets/addPet",
  async (petData, thunkAPI) => {
    try {
      const response = await addPet(petData);
      return response.pet;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add pet"
      );
    }
  }
);

export const fetchShelterPets = createAsyncThunk(
  "pets/getShelterPets",
  async (_, thunkAPI) => {
    try {
      const response = await getShelterPets();
      return response.pets;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pets"
      );
    }
  }
);

export const updateExistingPet = createAsyncThunk(
  "pets/updatePet",
  async ({ id, petData }, thunkAPI) => {
    try {
      const response = await updatePet(id, petData);
      return response.pet;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update pet"
      );
    }
  }
);

export const deletePetById = createAsyncThunk(
  "pets/deletePet",
  async (id, thunkAPI) => {
    try {
      await deletePet(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete pet"
      );
    }
  }
);

const initialState = {
  pets: [],
  isLoading: false,
  error: null,
  success: false,
};

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    resetPetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Pet
      .addCase(addNewPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.pets.push(action.payload);
      })
      .addCase(addNewPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Pets
      .addCase(fetchShelterPets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShelterPets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pets = action.payload;
      })
      .addCase(fetchShelterPets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Pet
      .addCase(updateExistingPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const index = state.pets.findIndex(
          (pet) => pet._id === action.payload._id
        );
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
      })
      .addCase(updateExistingPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Pet
      .addCase(deletePetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.pets = state.pets.filter((pet) => pet._id !== action.payload);
      })
      .addCase(deletePetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPetState } = petSlice.actions;
export default petSlice.reducer;