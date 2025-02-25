import express from "express";
import {
  submitApplication,
  getShelterApplications,
  updateApplicationStatus,
} from "../controllers/adoptionController.js";
import {
  authenticate,
  authorize,
  isShelterApproved,
} from "../middleware/authMiddleware.js";
import {
  adoptionApplicationValidation,
  updateApplicationStatusValidation,
} from "../middleware/validation.js";

const router = express.Router();

// Submit application (requires authentication and validation)
router.post(
  "/submit",
  authenticate,
  adoptionApplicationValidation,
  submitApplication
);

// Get shelter's received applications (requires shelter authentication)
router.get(
  "/shelter/applications",
  authenticate,
  authorize("shelter"),
  isShelterApproved,
  getShelterApplications
);

// Update application status (requires shelter authentication)
router.patch(
  "/:id/status",
  authenticate,
  authorize("shelter"),
  isShelterApproved,
  updateApplicationStatusValidation,
  updateApplicationStatus
);

export default router;