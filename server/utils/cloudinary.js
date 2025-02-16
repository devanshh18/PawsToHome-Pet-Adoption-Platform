import { v2 as cloudinary } from "cloudinary";
import createError from "http-errors";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "shelter_licenses",
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary error:", error);
    throw createError(500, "Error uploading file to Cloudinary");
  }
};

export const uploadPetToCloudianry = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "pets_images",
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary error:", error);
    throw createError(500, "Error uploading file to Cloudinary");
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw createError(500, "Error deleting file from Cloudinary");
  }
};