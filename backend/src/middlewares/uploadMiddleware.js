const multer = require("multer");

/**
 * uploadMiddleware.js
 * Uses multer memory storage — files are uploaded to Cloudinary
 * manually inside each controller using the cloudinaryUpload helper.
 * This avoids the multer v2 incompatibility with multer-storage-cloudinary v4.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diizinkan."), false);
    }
  },
});

module.exports = upload;
