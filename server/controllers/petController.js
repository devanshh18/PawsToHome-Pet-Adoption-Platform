import createError from "http-errors";
import Pet from "../models/Pet.js";
import { uploadPetToCloudianry } from "../utils/cloudinary.js";

// Add a new pet
export const addPet = async (req, res, next) => {
  try {
    // Check for photos
    if (!req.files || !req.files.photos) {
      throw createError(400, "At least 2 photos are required");
    }
   

    const photos = Array.isArray(req.files.photos)
      ? req.files.photos
      : [req.files.photos];

    // Upload photos to Cloudinary
    const photoUrls = await Promise.all(
      photos.map((photo) => uploadPetToCloudianry(photo.tempFilePath))
    );

    // Create pet with shelter's ID
    const pet = await Pet.create({
      ...req.body,
      photos: photoUrls,
      shelterId: req.user._id,
    });

    res.status(201).json({
      success: true,
      pet,
    });
  } catch (error) {
    next(error);
  }
};

// Get shelter's own pets
// Get shelter's own pets
export const getShelterPets = async (req, res, next) => {
  try {
    // Only get pets belonging to the authenticated shelter
    const pets = await Pet.find({ shelterId: req.user._id });

    if (!pets) {
      throw createError(404, "No pets found");
    }

    res.json({
      success: true,
      count: pets.length,
      pets,
    });
  } catch (error) {
    next(error);
  }
};

// Update pet
export const updatePet = async (req, res, next) => {
  try {
    let updateData = { ...req.body };

    // Handle photo updates if any
    if (req.files && req.files.photos) {
      const photos = Array.isArray(req.files.photos)
        ? req.files.photos
        : [req.files.photos];

      const photoUrls = await Promise.all(
        photos.map((photo) => uploadPetToCloudianry(photo.tempFilePath))
      );

      updateData.photos = photoUrls;
    }

    const pet = await Pet.findOneAndUpdate(
      {
        _id: req.params.id,
        shelterId: req.user._id,
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!pet) {
      throw createError(404, "Pet not found");
    }

    res.json({
      success: true,
      pet,
    });
  } catch (error) {
    next(error);
  }
};

// Delete pet
export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOneAndDelete({
      _id: req.params.id,
      shelterId: req.user._id,
    });

    if (!pet) {
      throw createError(404, "Pet not found");
    }

    res.json({
      success: true,
      message: "Pet deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};