import express from "express";
import {
  addPet,
  getShelterPets,
  updatePet,
  deletePet,
  searchPets,
  getPetById,
} from "../controllers/petController.js";
import {
  authenticate,
  authorize,
  isShelterApproved,
} from "../middleware/authMiddleware.js";
import {
  addPetValidation,
  updatePetValidation,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/details/:id", getPetById);
router.get("/search", searchPets);

// Protected routes
router.use(authenticate);
router.use(authorize("shelter"));
router.use(isShelterApproved);

router.get("/shelter-pets", getShelterPets);
router.post("/", addPetValidation, addPet);
router.put("/:id", updatePetValidation, updatePet);
router.delete("/:id", deletePet);

export default router;