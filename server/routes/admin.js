import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate, authorize("admin"));

// Dashboard stats
router.get("/stats", adminController.getAdminStats);

// User management
router.get("/users", adminController.getAllUsers);
router.get("/shelters", adminController.getAllShelters);
router.get("/shelters/pending", adminController.getPendingShelters);
router.delete("/users/:id", adminController.deleteUser);
router.delete("/shelters/:id", adminController.deleteShelter);

// Shelter approval/rejection
router.patch("/shelters/:id/approve", adminController.approveShelter);
router.patch("/shelters/:id/reject", adminController.rejectShelter);

// System health
router.get("/system-health", adminController.getSystemHealth);
router.get("/system-history/:timeframe", adminController.getSystemHistory);

// Insights and analytics
router.get("/insights", adminController.getInsights);

// Admin creation
router.post("/create-admin", adminController.createAdmin);

//Generate reports
router.get("/reports/generate", adminController.generateReport);

export default router;
