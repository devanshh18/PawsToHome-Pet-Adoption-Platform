import mongoose from "mongoose";
import { formatPetAge } from "../utils/formatPetAge.js";

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    age: {
      years: { type: Number, required: true },
      months: { type: Number, required: true, min: 0, max: 11 },
    },
    species: { type: String, enum: ["Dog", "Cat", "Other"], required: true },
    breed: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    color: { type: String, required: true },
    weight: { type: String, required: true }, // Example: "12 kg"
    vaccinationStatus: { type: Boolean, required: true },
    temperament: {
      type: String,
      required: true,
    },
    goodWithKids: { type: Boolean, required: true },
    goodWithPets: { type: Boolean, required: true },
    description: { type: String, required: true },
    photos: [
      {
        type: String,
        required: true,
      },
    ],
    shelterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Adopted"],
      default: "Available",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field to format age
petSchema.virtual("formattedAge").get(function () {
  return formatPetAge(this.age.years, this.age.months);
});

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
