/**
 * cloudinaryHelper.js
 * Uploads a file buffer directly to Cloudinary.
 * Use this instead of multer-storage-cloudinary which is
 * incompatible with multer v2.
 */
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a multer file (memoryStorage) to Cloudinary.
 * @param {object} file   - multer file object (has .buffer and .originalname)
 * @param {string} folder - Cloudinary folder (default: "ecommerce_uploads")
 * @returns {Promise<string>} - secure_url of the uploaded image
 */
const uploadToCloudinary = (file, folder = "ecommerce_uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    Readable.from(file.buffer).pipe(stream);
  });
};

module.exports = { uploadToCloudinary };
