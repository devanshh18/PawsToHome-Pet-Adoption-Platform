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
    const uploadOptions = {
      folder: "shelter_licenses",
      resource_type: "auto",
    };

    // Handle both development and production environments
    let result;
    if (file && file.tempFilePath && process.env.NODE_ENV !== 'production') {
      // Local development with temp files
      result = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
    } else if (file && file.data) {
      // Production with buffer data
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(file.data);
      });
    } else {
      throw new Error('Invalid file upload format');
    }
    
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary error:", error);
    throw createError(500, "Error uploading file to Cloudinary: " + error.message);
  }
};

export const uploadPetToCloudianry = async (file) => {
  try {
    const uploadOptions = {
      folder: "pets",
      resource_type: "auto",
    };

    let result;
    if (process.env.NODE_ENV !== 'production' && file.tempFilePath) {
      result = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
    } else {
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(file.data);
      });
    }
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary error:", error);
    throw createError(500, "Error uploading pet image to Cloudinary");
  }
};

export const uploadPostToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "posts_images",
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