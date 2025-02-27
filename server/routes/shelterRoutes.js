import express from "express";
import { 
  getAllShelters,
  getShelterById
} from "../controllers/shelterController.js";

const router = express.Router();

// Public routes
router.get("/", getAllShelters);
router.get("/:id", getShelterById);

export default router;