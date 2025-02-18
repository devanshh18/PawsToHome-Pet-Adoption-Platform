import jwt from "jsonwebtoken";
import crypto from "crypto";
import createError from "http-errors";
import User from "../models/User.js";
import Shelter from "../models/Shelter.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Set cookie with token
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNo: user.phoneNo,
        ...(user.role === "shelter" && {
          shelterName: user.shelterName,
          state: user.state,
          city: user.city,
          shelter: user.shelter,
          address: user.address,
          status: user.status,
        }),
      },
    });
};

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return {
    resetToken, // Original Token(Not stored in DB)
    hashedToken, // For Store in Database
  };
};

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, phoneNo } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw createError(400, "Email already registered");
    }

    const user = await User.create({
      email,
      password,
      name,
      phoneNo,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// Register Shelter
export const registerShelter = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      phoneNo,
      shelterName,
      city,
      state,
      address,
    } = req.body;

    // check if file exists
    if (!req.files || !req.files.licenseDocument) {
      throw createError(400, "License document is required");
    }

    const licenseDocument = req.files.licenseDocument;

    //email check - allow rejected shelters to register again
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but is not a rejected shelter, throw error
      if (
        existingUser.role !== "shelter" ||
        existingUser.status !== "rejected"
      ) {
        throw createError(400, "Email already registered");
      }
      // If it's a rejected shelter, delete the old record
      await User.findByIdAndDelete(existingUser._id);
    }

    if (!licenseDocument.mimetype.startsWith("image/")) {
      throw createError(400, "Please upload an image file");
    }
    // Upload license document to Cloudinary
    const licenseUrl = await uploadToCloudinary(licenseDocument.tempFilePath);

    const shelter = await Shelter.create({
      email,
      password,
      name,
      phoneNo,
      shelterName,
      city,
      state,
      address,
      licenseDocument: licenseUrl,
    });

    res.status(201).json({
      success: true,
      message: "Shelter registration submitted for approval",
    });
  } catch (error) {
    next(error);
  }
};

// Login User/Shelter
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // console.log to debug
    console.log({
      userFound: !!user,
      userRole: user?.role,
      email: email,
    });

    if (!user) {
      throw createError(401, "No account found with this email address");
    }

    // Check if shelter is approved or rejected
    if (user.role === "shelter") {
      switch (user.status) {
        case "rejected":
          throw createError(
            401,
            "Your shelter registration was rejected. Please register again with updated information"
          );
        case "pending":
          throw createError(
            401,
            "Your shelter registration is pending approval. You'll receive an email once approved"
          );
      }
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw createError(401, "Invalid credentials");
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found");
    }

    const { resetToken, hashedToken } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw createError(400, "Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (req, res, next) => {
  try {
    // User is already available from auth middleware
    const user = req.user;

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNo: user.phoneNo,
        ...(user.role === "shelter" && {
          shelterName: user.shelterName,
          address: user.address,
          city: user.city,
          state: user.state,
          status: user.status,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};