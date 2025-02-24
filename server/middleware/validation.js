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

// export const addPetValidation = [
//   body("name")
//     .trim()
//     .notEmpty()
//     .withMessage("Pet name is required")
//     .isLength({ max: 50 })
//     .withMessage("Name cannot exceed 50 characters"),

//   body("age.years")
//     .isInt({ min: 0 })
//     .withMessage("Years must be a positive number"),

//   body("age.months")
//     .isInt({ min: 0, max: 11 })
//     .withMessage("Months must be between 0 and 11"),

//   body("species").isIn(["Dog", "Cat", "Other"]).withMessage("Invalid species"),

//   body("breed").trim().notEmpty().withMessage("Breed is required"),

//   body("gender").isIn(["Male", "Female"]).withMessage("Invalid gender"),

//   body("color").trim().notEmpty().withMessage("Color is required"),

//   body("weight").trim().notEmpty().withMessage("Weight is required"),

//   body("vaccinationStatus")
//     .isBoolean()
//     .withMessage("Vaccination status must be true or false"),

//   body("temperament")
//     .isArray()
//     .withMessage("Temperament must be an array")
//     .custom((value) => {
//       if (!Array.isArray(value)) {
//         throw new Error("Temperament must be an array");
//       }
//       const validTemperaments = ["calm", "energetic", "friendly", "shy"];
//       return value.every((temp) => validTemperaments.includes(temp));
//     }),

//   body("goodWithKids")
//     .isBoolean()
//     .withMessage("Good with kids must be true or false"),

//   body("goodWithPets")
//     .isBoolean()
//     .withMessage("Good with pets must be true or false"),

//   body("description").trim().notEmpty().withMessage("Description is required"),
//   body("photos").custom((value, { req }) => {
//     // Debug log
//     console.log("Files received:", req.files);

//     if (!req.files || !req.files.photos) {
//       throw new Error("At least 2 photos are required");
//     }

//     // Ensure photos is always an array
//     const photos = Array.isArray(req.files.photos)
//       ? req.files.photos
//       : [req.files.photos];

//     console.log("Number of photos:", photos.length);

//     if (photos.length < 2 || photos.length > 5) {
//       throw new Error("Minimum 2 and maximum 5 photos allowed");
//     }

//     for (const photo of photos) {
//       console.log("Photo type:", photo.mimetype);
//       if (!photo.mimetype.startsWith("image/")) {
//         throw new Error("Please upload only image files");
//       }
//       if (photo.size > 2 * 1024 * 1024) {
//         throw new Error("Each photo must be less than 2MB");
//       }
//     }

//     return true;
//   }),

//   validate,
// ];
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
      throw new Error("At least 1 photos are required");
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