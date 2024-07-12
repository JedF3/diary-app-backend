import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDKEY,
  api_secret: process.env.CLOUDSECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "diary_app",
    allowedFormats:["jpeg","jpg", "png"],
  },
});

export { cloudinary, storage };
