import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password) {
          // Skip validation if password isn't modified
          if (!this.isModified("password")) return true;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
            password
          );
        },
      },
    },
    role: {
      type: String,
      enum: ["user", "shelter", "admin"],
      default: "user",
    },
    phoneNo: {
      type: String,
      required: function () {
        return this.role !== "admin"; // Admins don't need phone number
      },
      trim: true,
      validate: {
        validator: function (phone) {
          return /^\d{10}$/.test(phone);
        },
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Basic validation
    if (!candidatePassword) {
      throw new Error("Password is required for comparison");
    }

    if (!this.password) {
      // If password field is missing, fetch the fresh user data with password
      const freshUser = await this.constructor
        .findById(this._id)
        .select("+password");
      if (!freshUser || !freshUser.password) {
        throw new Error("User password data cannot be retrieved");
      }
      return bcrypt.compare(candidatePassword, freshUser.password);
    }

    // Normal flow when password is available
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    throw new Error("Failed to verify password");
  }
};

const User = mongoose.model("User", userSchema);

export default User;
