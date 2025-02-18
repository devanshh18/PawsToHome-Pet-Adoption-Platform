import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addPet,
  getShelterPets,
  updatePet,
  deletePet,
  searchPets,
  getPetById,
} from "./petService";

export const addNewPet = createAsyncThunk("pets/addPet", async (petData, thunkAPI) => {
  try {
    const response = await addPet(petData);
    return response.pet;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add pet");
  }
});

export const fetchShelterPets = createAsyncThunk("pets/getShelterPets", async (_, thunkAPI) => {
  try {
    const response = await getShelterPets();
    return response.pets;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch pets");
  }
});

export const updateExistingPet = createAsyncThunk("pets/updatePet", async ({ id, petData }, thunkAPI) => {
  try {
    const response = await updatePet(id, petData);
    return response.pet;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update pet");
  }
});

export const deletePetById = createAsyncThunk("pets/deletePet", async (id, thunkAPI) => {
  try {
    await deletePet(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete pet");
  }
});

export const searchPetsByLocation = createAsyncThunk("pets/searchPets", async (filters, thunkAPI) => {
  try {
    const response = await searchPets(filters);
    return response.pets;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to search pets");
  }
});

export const fetchPetById = createAsyncThunk("pets/getPetById", async (id, thunkAPI) => {
  try {
    const response = await getPetById(id);
    return response.pet;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch pet details");
  }
});

const initialState = {
  pets: [],
  selectedPet: null,
  searchResults: [],
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
      .addCase(updateExistingPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const index = state.pets.findIndex((pet) => pet._id === action.payload._id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
      })
      .addCase(updateExistingPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(searchPetsByLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPetsByLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPetsByLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPet = action.payload;
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPetState } = petSlice.actions;
export default petSlice.reducer;