import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const requiredCredentials = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const hasIndividualCredentials = requiredCredentials.every((name) =>
  process.env[name]?.trim(),
);
const hasCloudinaryUrl = Boolean(process.env.CLOUDINARY_URL?.trim());
const missingCredentials =
  hasIndividualCredentials || hasCloudinaryUrl
    ? []
    : requiredCredentials.filter((name) => !process.env[name]?.trim());

if (missingCredentials.length > 0) {
  throw new Error(
    `Missing Cloudinary environment variables: ${missingCredentials.join(", ")}`,
  );
}

if (hasIndividualCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  });
} else {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL.trim() });
}

export const uploadPdf = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "studyhub/notes",
        resource_type: "auto",
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );

    stream.end(file.buffer);
  });

export default cloudinary;
