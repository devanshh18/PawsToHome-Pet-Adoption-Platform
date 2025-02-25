import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";
import petReducer from "../features/pets/petSlice";
import adoptionReducer from "../features/adoptionProcess/adoptionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    pets: petReducer,
    adoption: adoptionReducer,
  },
});