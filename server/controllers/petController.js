import createError from "http-errors";
import Pet from "../models/Pet.js";
import { uploadPetToCloudianry } from "../utils/cloudinary.js";
import Shelter from "../models/Shelter.js";
// Add a new pet
export const addPet = async (req, res, next) => {
  try {
    // Check for photos
    if (!req.files || !req.files.photos) {
      throw createError(400, "At least 1 photo is required");
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

// Get pet by ID with shelter details
export const searchPets = async (req, res, next) => {
  try {
    const {
      city,
      state,
      gender,
      species,
      ageRange,
      goodWithKids,
      goodWithPets,
      vaccinationStatus,
    } = req.query;

    // Find shelters by location
    const shelterQuery = {};
    if (city) shelterQuery["city"] = new RegExp(city, "i");
    if (state) shelterQuery["state"] = new RegExp(state, "i");
    shelterQuery.status = "approved";

    const shelterIds = await Shelter.find(shelterQuery).distinct("_id");

    // Build pet query
    const petQuery = {
      shelterId: { $in: shelterIds },
      status: "Available",
    };

    // Add additional filters
    if (gender) petQuery.gender = gender;
    if (species) petQuery.species = species;
    if (goodWithKids) petQuery.goodWithKids = goodWithKids === "true";
    if (goodWithPets) petQuery.goodWithPets = goodWithPets === "true";
    if (vaccinationStatus)
      petQuery.vaccinationStatus = vaccinationStatus === "true";

    // Handle age range
    if (ageRange) {
      // Convert string to array if needed
      const ageRanges = Array.isArray(ageRange)
        ? ageRange
        : ageRange.split(",");

      // Create an OR condition for multiple age ranges
      const ageQueries = ageRanges
        .map((range) => {
          switch (range) {
            case "baby":
              return {
                $and: [{ "age.years": 0 }, { "age.months": { $gt: 0 } }],
              };
            case "young":
              return { "age.years": { $gte: 1, $lte: 3 } };
            case "adult":
              return { "age.years": { $gte: 4, $lte: 7 } };
            case "senior":
              return { "age.years": { $gte: 8 } };
            default:
              return null;
          }
        })
        .filter((query) => query !== null);

      // Add the age query to petQuery if there are valid ranges
      if (ageQueries.length > 0) {
        petQuery["$or"] = ageQueries;
      }
    }

    const pets = await Pet.find(petQuery).populate({
      path: "shelterId",
      select: "name city state contact shelterName",
    });

    res.json({
      success: true,
      count: pets.length,
      pets,
    });
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id).populate({
      path: "shelterId",
      select: "name email phoneNo shelterName city state address",
      match: { status: "approved" },
    });

    if (!pet || !pet.shelterId) {
      throw createError(404, "Pet not found or shelter not approved");
    }

    res.json({
      success: true,
      pet,
    });
  } catch (error) {
    next(error);
  }
};
