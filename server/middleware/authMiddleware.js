import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/User.js";

// Verify JWT token middleware
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from cookie
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw createError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw createError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, "Invalid token"));
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError(403, "Not authorized to access this route"));
    }
    next();
  };
};

// Check if shelter is approved middleware
export const isShelterApproved = async (req, res, next) => {
  try {
    if (req.user.role === "shelter" && req.user.status !== "approved") {
      throw createError(403, "Shelter account is not approved yet");
    }
    next();
  } catch (error) {
    next(error);
  }
};