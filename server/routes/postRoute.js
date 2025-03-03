import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  addComment,
  toggleLike,
} from "../controllers/PostController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  postValidation,
  commentValidation,
  updatePostValidation,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);

// FIXED: Move this route BEFORE the /:id route 
router.get("/user", authenticate, getUserPosts);

// Now the /:id route won't match "/user"
router.get("/:id", getPostById);

// Protected routes
router.use(authenticate);
router.post("/", postValidation, createPost);
router.put("/:id", updatePostValidation, updatePost);
router.delete("/:id", deletePost);
router.post("/:id/comments", commentValidation, addComment);
router.post("/:id/like", toggleLike);

export default router;
