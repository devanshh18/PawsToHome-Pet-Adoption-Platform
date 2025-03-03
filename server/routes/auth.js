import express from "express";
import {
  registerUser,
  registerShelter,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import {
  registerUserValidation,
  registerShelterValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../middleware/validation.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register/user", registerUserValidation, registerUser);
router.post("/register/shelter", registerShelterValidation, registerShelter);
router.post("/login", loginValidation, login);
router.post("/logout", logout); // Add logout route
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidation, resetPassword);
router.get("/me", authenticate, getMe);
router.put("/update-profile", authenticate, updateProfile);

export default router;
