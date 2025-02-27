import createError from "http-errors";
import Post from "../models/Post.js";
import { uploadPostToCloudinary } from "../utils/cloudinary.js";

// Create a new post
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;
    let photoUrls = [];

    // Handle multiple image uploads
    if (req.files && req.files.photos) {
      const photos = Array.isArray(req.files.photos)
        ? req.files.photos
        : [req.files.photos];

      // Upload all photos to Cloudinary
      photoUrls = await Promise.all(
        photos.map((photo) => uploadPostToCloudinary(photo.tempFilePath))
      );
    }

    const post = await Post.create({
      title,
      content,
      photos: photoUrls,
      author: req.user._id,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts with pagination
export const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const tag = req.query.tag;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "name role",
      });

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Get post by ID
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "author",
        select: "name role",
      })
      .populate({
        path: "comments.user",
        select: "name",
      });

    if (!post) {
      throw createError(404, "Post not found");
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Update post
export const updatePost = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;
    let post = await Post.findById(req.params.id);

    if (!post) {
      throw createError(404, "Post not found");
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      throw createError(403, "Not authorized to update this post");
    }

    // Handle image updates if present
    let photoUrls = post.photos;
    if (req.files && req.files.photos) {
      const photos = Array.isArray(req.files.photos)
        ? req.files.photos
        : [req.files.photos];

      // Upload all photos to Cloudinary
      photoUrls = await Promise.all(
        photos.map((photo) => uploadPostToCloudinary(photo.tempFilePath))
      );
    }

    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        photos: photoUrls,
        category,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : post.tags,
      },
      { new: true }
    );

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createError(404, "Post not found");
    }

    // Check if user is the author or an admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw createError(403, "Not authorized to delete this post");
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Add comment to post
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createError(404, "Post not found");
    }

    post.comments.unshift({
      user: req.user._id,
      text,
    });

    await post.save();

    // Populate the newly added comment
    const populatedPost = await Post.findById(post._id).populate({
      path: "comments.user",
      select: "name",
    });

    res.json({
      success: true,
      comments: populatedPost.comments,
    });
  } catch (error) {
    next(error);
  }
};

// Like/unlike post
export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createError(404, "Post not found");
    }

    // Check if post has already been liked by user
    const likeIndex = post.likes.findIndex(
      (id) => id.toString() === req.user._id.toString()
    );

    if (likeIndex === -1) {
      // Not liked yet, add like
      post.likes.push(req.user._id);
    } else {
      // Already liked, remove like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};