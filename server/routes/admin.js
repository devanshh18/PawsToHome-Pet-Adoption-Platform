import express from "express";
import {
  getPendingShelters,
  approveShelter,
  rejectShelter,
  createAdmin,
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes - only admin access
router.use(authenticate, authorize("admin"));

router.post("/create-admin", createAdmin); // Only existing admin can create new admin
router.get("/shelters/pending", getPendingShelters);
router.patch("/shelters/approve/:id", approveShelter);
router.patch("/shelters/reject/:id", rejectShelter);

export default router;