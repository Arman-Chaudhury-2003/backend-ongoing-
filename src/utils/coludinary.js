/* BASICALLY- user=uplodes file using multer, multer puts file =local storage,  local file gets uploaded =cloudinary, file=deleted from our local system */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
    console.log("File has been successfully uploaded", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //je file ta upload holo seta locally saved ache so ota remove korbo cause the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
