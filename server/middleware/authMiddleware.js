import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/User.js";

// Verify JWT token middleware
export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    let token = req.cookies.token;
    
    // If no token in cookies, check authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : req.headers.authorization;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
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