import createError from "http-errors";
import Pet from "../models/Pets.js";
import Adoption from "../models/AdoptionApplication.js";
import {
  sendApplicationConfirmation,
  sendShelterNotification,
  sendApplicationStatus,
} from "../utils/emailService.js";

// Submit adoption application
export const submitApplication = async (req, res, next) => {
  try {
    // Check if pet exists and is available for applications
    const pet = await Pet.findById(req.body.petId);
    if (!pet) {
      throw createError(404, "Pet not found");
    }
    if (pet.status === "Adopted") {
      throw createError(400, "This pet has already been adopted");
    }

    // Check for existing pending applications from this user for this pet
    const existingApplication = await Adoption.findOne({
      petId: req.body.petId,
      adopterId: req.body.adopterId,
      status: "pending",
    });

    if (existingApplication) {
      throw createError(
        400,
        "You already have a pending application for this pet"
      );
    }

    // Create the adoption application
    const application = await Adoption.create(req.body);

    // Get shelter email for notification
    const petWithShelter = await Pet.findById(req.body.petId).populate({
      path: "shelterId",
      select: "email",
    });

    // Send confirmation emails
    await Promise.all([
      sendApplicationConfirmation(req.user.email),
      sendShelterNotification(petWithShelter.shelterId.email, req.body),
    ]);

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// Get shelter's received applications
export const getShelterApplications = async (req, res, next) => {
  try {
    // Find all pets owned by the shelter
    const shelterPets = await Pet.find({ shelterId: req.user._id });
    const petIds = shelterPets.map((pet) => pet._id);

    // Get applications for these pets
    const applications = await Adoption.find({
      petId: { $in: petIds },
    })
      .sort({ createdAt: -1 }) // Most recent first
      .populate([
        {
          path: "petId",
          select: "name photos status age",
        },
        {
          path: "adopterId",
          select: "name email phoneNo",
        },
      ]);

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Update application status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    // Find the application and verify shelter ownership
    const application = await Adoption.findById(req.params.id).populate([
      {
        path: "petId",
        select: "shelterId status",
      },
      {
        path: "adopterId",
        select: "email",
      },
    ]);

    if (!application) {
      throw createError(404, "Application not found");
    }

    // Verify shelter ownership
    if (application.petId.shelterId.toString() !== req.user._id.toString()) {
      throw createError(403, "Not authorized to update this application");
    }

    // If pet is already adopted and trying to approve or reject another application
    if (application.petId.status === "Adopted" && status === "approved") {
      throw createError(400, "This pet has already been adopted");
    }

    // Update application status
    application.status = status;
    if (status === "rejected" && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    // If approved
    if (status === "approved") {
      // Update pet status to Adopted
      await Pet.findByIdAndUpdate(application.petId._id, { status: "Adopted" });

      // Find and reject all other pending applications for this pet
      const otherApplications = await Adoption.find({
        petId: application.petId._id,
        _id: { $ne: application._id },
        status: "pending",
      }).populate({
        path: "adopterId",
        select: "email",
      });

      // Update status and send rejection emails
      await Promise.all([
        // Update all other applications to rejected
        Adoption.updateMany(
          {
            petId: application.petId._id,
            _id: { $ne: application._id },
            status: "pending",
          },
          {
            status: "rejected",
            rejectionReason: "Another applicant was selected for this pet",
          }
        ),
        // Send approval email to selected adopter
        sendApplicationStatus(application.adopterId.email, "approved"),
        // Send rejection emails to other applicants
        ...otherApplications.map((app) =>
          sendApplicationStatus(
            app.adopterId.email,
            "rejected",
            "Another applicant was selected for this pet"
          )
        ),
      ]);
    } else if (status === "rejected") {
      // Send rejection email
      await sendApplicationStatus(
        application.adopterId.email,
        "rejected",
        rejectionReason
      );
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's submitted applications
export const getUserApplications = async (req, res, next) => {
  try {
    const applications = await Adoption.find({
      adopterId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "petId",
          select: "name photos breed gender age status",
          populate: {
            path: "shelterId",
            select: "name shelterName email phoneNo",
          },
        },
      ]);

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
