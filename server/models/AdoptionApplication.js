import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    adopterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    livingArrangement: {
      homeType: {
        type: String,
        enum: ["house", "apartment", "condo"],
        required: true,
      },
      hasYard: {
        type: Boolean,
        required: true,
      },
      ownership: {
        type: String,
        enum: ["own", "rent", "live_with_family"],
        required: true,
      },
    },
    householdInfo: {
      numberOfAdults: {
        type: Number,
        required: true,
        min: 1,
      },
      hasChildren: {
        type: Boolean,
        required: true,
      },
    },
    petExperience: {
      hasOtherPets: {
        type: Boolean,
        required: true,
      },
      previousExperience: {
        type: String,
        trim: true,
      },
    },
    adoptionDetails: {
      reason: {
        type: String,
        required: true,
        trim: true,
      },
      schedule: {
        type: String,
        required: true,
        trim: true,
      },
    },
    agreementAccepted: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "You must accept the adoption agreement",
      },
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Adoption", adoptionSchema);