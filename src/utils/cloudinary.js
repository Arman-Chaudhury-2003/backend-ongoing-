/* BASICALLY- user=uplodes file using multer, multer puts file =local storage,  local file gets uploaded =cloudinary, file=deleted from our local system */

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "process";

// Configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    //why awaite ? file takes time to upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //confirmation
    // console.log("File has been successfully uploaded", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("there is an error", error);
    fs.unlinkSync(localFilePath); //je file ta upload holo seta locally saved ache so ota remove korbo cause the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
