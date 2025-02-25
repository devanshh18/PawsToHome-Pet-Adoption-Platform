import { body, validationResult } from "express-validator";

// Validation error handler

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // if there are errors
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// User registration validation rules
export const registerUserValidation = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password must contain at least 6 characters, including one uppercase, one lowercase, one number, and one special character"
    ),
  body("name").notEmpty().withMessage("Name is required"),
  body("phoneNo")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be 10 digits"),

  validate,
];

// Shelter registration validation rules
export const registerShelterValidation = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password must contain at least 6 characters, including one uppercase, one lowercase, one number, and one special character"
    ),
  body("name").notEmpty().withMessage("Name is required"),
  body("phoneNo")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be 10 digits"),
  body("shelterName").notEmpty().withMessage("Shelter name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("licenseDocument").custom((value, { req }) => {
    if (!req.files || !req.files.licenseDocument) {
      throw new Error("License document is required");
    }
    const file = req.files.licenseDocument;
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Please upload an image file");
    }
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 2MB");
    }
    return true;
  }),

  validate,
];

// Login validation rules
export const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  validate,
];

// Password reset validation rules
export const resetPasswordValidation = [
  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password must contain at least 6 characters, including one uppercase, one lowercase, one number, and one special character"
    ),
  validate,
];

const commonPetValidations = (isUpdate = false) => {
  const opt = isUpdate ? { optional: true } : {};
  return [
    body("name", "Pet name is required")
      .if(() => !isUpdate)
      .trim()
      .notEmpty()
      .withMessage("Pet name is required")
      .isLength({ max: 50 })
      .withMessage("Name cannot exceed 50 characters")
      .bail(),
    body("age.years", "Years must be a positive number")
      .if(() => !isUpdate)
      .isInt({ min: 0 })
      .withMessage("Years must be a positive number")
      .bail()
      .optional(isUpdate),
    body("age.months", "Months must be between 0 and 11")
      .if(() => !isUpdate)
      .isInt({ min: 0, max: 11 })
      .withMessage("Months must be between 0 and 11")
      .bail()
      .optional(isUpdate),
    body("species", "Invalid species")
      .if(() => !isUpdate)
      .isIn(["Dog", "Cat", "Other"])
      .withMessage("Invalid species")
      .bail()
      .optional(isUpdate),
    body("breed", "Breed is required")
      .if(() => !isUpdate)
      .trim()
      .notEmpty()
      .withMessage("Breed is required")
      .bail()
      .optional(isUpdate),
    body("gender", "Invalid gender")
      .if(() => !isUpdate)
      .isIn(["Male", "Female"])
      .withMessage("Invalid gender")
      .bail()
      .optional(isUpdate),
    body("color", "Color is required")
      .if(() => !isUpdate)
      .trim()
      .notEmpty()
      .withMessage("Color is required")
      .bail()
      .optional(isUpdate),
    body("weight", "Weight is required")
      .if(() => !isUpdate)
      .trim()
      .notEmpty()
      .withMessage("Weight is required")
      .bail()
      .optional(isUpdate),
    body("vaccinationStatus", "Vaccination status must be true or false")
      .if(() => !isUpdate)
      .isBoolean()
      .withMessage("Vaccination status must be true or false")
      .bail()
      .optional(isUpdate),
    body("temperament", "Temperament is required")
      .if(() => !isUpdate)
      .notEmpty()
      .withMessage("Temperament is required")
      .bail()
      .optional(isUpdate),
    body("goodWithKids", "Good with kids must be true or false")
      .if(() => !isUpdate)
      .isBoolean()
      .withMessage("Good with kids must be true or false")
      .bail()
      .optional(isUpdate),
    body("goodWithPets", "Good with pets must be true or false")
      .if(() => !isUpdate)
      .isBoolean()
      .withMessage("Good with pets must be true or false")
      .bail()
      .optional(isUpdate),
    body("description", "Description is required")
      .if(() => !isUpdate)
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .bail()
      .optional(isUpdate),
  ];
};

// Validation for adding a pet (all fields required)
export const addPetValidation = [
  ...commonPetValidations(false),
  body("photos").custom((value, { req }) => {
    if (!req.files || !req.files.photos) {
      throw new Error("At least 1 photo is required");
    }
    const photos = Array.isArray(req.files.photos)
      ? req.files.photos
      : [req.files.photos];
    if (photos.length < 1 || photos.length > 4) {
      throw new Error("Minimum 1 and maximum 4 photos allowed");
    }
    photos.forEach((photo) => {
      if (!photo.mimetype.startsWith("image/")) {
        throw new Error("Please upload only image files");
      }
      if (photo.size > 2 * 1024 * 1024) {
        throw new Error("Each photo must be less than 2MB");
      }
    });
    return true;
  }),
  validate,
];

// Validation for updating a pet (making fields optional)
export const updatePetValidation = [
  ...commonPetValidations(true),
  body("photos")
    // .optional()
    .custom((value, { req }) => {
      if (!req.files || !req.files.photos) {
        return true;
      }
      const photos = Array.isArray(req.files.photos)
        ? req.files.photos
        : [req.files.photos];
      if (photos.length < 1 || photos.length > 4) {
        throw new Error("Minimum 1 and maximum 4 photos allowed");
      }
      photos.forEach((photo) => {
        if (!photo.mimetype.startsWith("image/")) {
          throw new Error("Please upload only image files");
        }
        if (photo.size > 2 * 1024 * 1024) {
          throw new Error("Each photo must be less than 2MB");
        }
      });
      return true;
    }),
  // Photos can be optionally updated too:

  validate,
];

// Adoption application validation
export const adoptionApplicationValidation = [
  body("petId").notEmpty().isMongoId().withMessage("Valid pet ID is required"),
  body("adopterId")
    .notEmpty()
    .isMongoId()
    .withMessage("Valid adopter ID is required"),
  body("livingArrangement.homeType")
    .isIn(["house", "apartment", "condo"])
    .withMessage("Invalid home type"),
  body("livingArrangement.hasYard")
    .isBoolean()
    .withMessage("Has yard must be true or false"),
  body("livingArrangement.ownership")
    .isIn(["own", "rent", "live_with_family"])
    .withMessage("Invalid ownership status"),
  body("householdInfo.numberOfAdults")
    .isInt({ min: 1 })
    .withMessage("Number of adults must be at least 1"),
  body("householdInfo.hasChildren")
    .isBoolean()
    .withMessage("Has children must be true or false"),
  body("petExperience.hasOtherPets")
    .isBoolean()
    .withMessage("Has other pets must be true or false"),
  body("adoptionDetails.reason")
    .trim()
    .notEmpty()
    .withMessage("Adoption reason is required"),
  body("adoptionDetails.schedule")
    .trim()
    .notEmpty()
    .withMessage("Schedule information is required"),
  body("agreementAccepted")
    .isBoolean()
    .custom((value) => value === true)
    .withMessage("You must accept the adoption agreement"),
  validate,
];

// Application status update validation
export const updateApplicationStatusValidation = [
  body("status").isIn(["approved", "rejected"]).withMessage("Invalid status"),
  body("rejectionReason")
    .if(body("status").equals("rejected"))
    .notEmpty()
    .withMessage("Rejection reason is required when rejecting an application"),
  validate,
];