import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
export const uploadToCloudinary = async (file) => {
  console.log("upload to cloudinary");
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path);
    // Delete uploaded file from the local directory
    fs.unlink(file.path, (error) => {
      if (error) {
        console.log("Failed to delete the file:", error);
      }
    });
    // Return the public image URL
    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
