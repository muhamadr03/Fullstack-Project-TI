const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Konfigurasi Cloudinary dari Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Pengaturan Penyimpanan di Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_uploads", // Folder di dalam Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Tipe file yang diizinkan
    // transformation: [{ width: 800, height: 800, crop: "limit" }] // Opsional: kompresi/resize gambar
  },
});

// 2. Eksekusi Multer (Maksimal ukuran file 5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
