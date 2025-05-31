import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async function (localPath) {
  if (!localPath) return null;
  try {
    const res = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    if (!res.url) throw new Error("Can not upload to cloudinary");

    fs.unlinkSync(localPath);
    return res;
  } catch (error) {
    fs.unlinkSync(localPath);
    throw new Error(error.message || "Can not upload to cloudinary");
  }
};

export default uploadOnCloudinary;
