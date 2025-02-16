import express from "express";
import {
  addPet,
  getShelterPets,
  updatePet,
  deletePet,
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

// Apply authentication middleware to all routes
router.use(authenticate);
// Apply shelter role check
router.use(authorize("shelter"));
// Apply shelter approval check
router.use(isShelterApproved);

router.post("/", addPetValidation, addPet);
router.get("/shelter-pets", getShelterPets);
router.put("/:id", updatePetValidation, updatePet);
router.delete("/:id", deletePet);

export default router;