import { v2 as cloudinary } from "cloudinary";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "posts" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
};

export default uploadToCloudinary;
