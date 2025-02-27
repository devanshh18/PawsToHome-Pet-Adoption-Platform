import createError from "http-errors";
import Shelter from "../models/Shelter.js";

// Get all shelters with filtering
export const getAllShelters = async (req, res, next) => {
  try {
    const { city, state, page = 1, limit = 8 } = req.query;

    // Build query based on filters
    const query = { status: "approved" }; // Only return approved shelters

    // Add location filter if provided
    if (city) query.city = new RegExp(city, "i");
    if (state) query.state = new RegExp(state, "i");

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const shelters = await Shelter.find(query)
      .select("shelterName address city state phoneNo email description")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ shelterName: 1 });

    // Get total count for pagination
    const totalCount = await Shelter.countDocuments(query);

    res.status(200).json({
      success: true,
      shelters,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get shelter by ID
export const getShelterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shelter = await Shelter.findOne({
      _id: id,
      status: "approved", // Only return approved shelters
    });

    if (!shelter) {
      throw createError(404, "Shelter not found");
    }

    res.status(200).json({
      success: true,
      shelter,
    });
  } catch (error) {
    next(error);
  }
};
