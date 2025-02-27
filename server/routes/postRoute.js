import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
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
router.get("/:id", getPostById);

// Protected routes
router.use(authenticate);
router.post("/", postValidation, createPost);
router.put("/:id", updatePostValidation, updatePost);
router.delete("/:id", deletePost);
router.post("/:id/comments", commentValidation, addComment);
router.post("/:id/like", toggleLike);

export default router;