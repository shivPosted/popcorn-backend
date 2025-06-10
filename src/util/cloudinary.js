import { v2 as cloudinary } from "cloudinary";
import { createReadStream } from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// NOTE: upload function for localPath upload
// const uploadOnCloudinary = async function (localPath) {
//   if (!localPath) return null;
//   try {
//     const res = await cloudinary.uploader.upload(localPath, {
//       resource_type: "auto",
//     });
//     if (!res.url) throw new Error("Can not upload to cloudinary");
//
//     fs.unlinkSync(localPath);
//     return res;
//   } catch (error) {
//     fs.unlinkSync(localPath);
//     throw new Error(error.message || "Can not upload to cloudinary");
//   }
// };
//
//NOTE: upload for buffer
const uploadOnCloudinary = function (buffer) {
  return new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "popcorn",
      },
      (err, uploadResult) => {
        if (err) rej(err);
        else res(uploadResult);
      },
    );
    createReadStream(buffer).pipe(stream);
  });
};

export default uploadOnCloudinary;
