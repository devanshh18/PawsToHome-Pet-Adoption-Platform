import mongoose from "mongoose";
import User from "./User.js";

const shelterSchema = new mongoose.Schema({
  shelterName: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  licenseDocument: {
    type: String, // Cloudinary URL
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
});

// Set role as shelter by default
shelterSchema.pre("save", function (next) {
  this.role = "shelter";
  next();
});

const Shelter = User.discriminator("Shelter", shelterSchema);

export default Shelter;