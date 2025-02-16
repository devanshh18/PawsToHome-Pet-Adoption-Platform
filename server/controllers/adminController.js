import createError from "http-errors";
import Shelter from "../models/Shelter.js";
import { sendShelterStatusEmail } from "../utils/emailService.js";

// Get all pending shelter registrations
export const getPendingShelters = async (req, res, next) => {
  try {
    const shelters = await Shelter.find({ status: "pending" }).select(
      "-password"
    );

    res.json({
      success: true,
      shelters,
    });
  } catch (error) {
    next(error);
  }
};

// Approve shelter registration
export const approveShelter = async (req, res, next) => {
  try {
    const shelter = await Shelter.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      { status: "approved" },
      { new: true, runValidators: false }
    );

    if (!shelter) {
      throw createError(404, "Shelter not found or not in pending state");
    }

    // Send approval email
    await sendShelterStatusEmail(shelter.email, "approved");

    res.json({
      success: true,
      message: "Shelter approved successfully",
    });
  } catch (error) {
    next(error);
  }
};


// Reject shelter registration
export const rejectShelter = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      throw createError(400, "Rejection reason is required");
    }

    const shelter = await Shelter.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      {
        status: "rejected",
        rejectionReason: reason,
      },
      { new: true, runValidators: false }
    );

    if (!shelter) {
      throw createError(404, "Shelter not found or not in pending state");
    }

    // Send rejection email
    await sendShelterStatusEmail(shelter.email, "rejected", reason);

    res.json({
      success: true,
      message: "Shelter rejected successfully",
    });
  } catch (error) {
    next(error);
  }
};

// CreateAdmin
export const createAdmin = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(400, "Email already exists");
    }

    // Create new admin
    const admin = await User.create({
      email,
      password,
      name,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};