const multer = require("multer");
const path = require("path");

// 1. Pengaturan Tempat Penyimpanan & Penamaan File
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Pastikan folder ini sudah dibuat!
  },
  filename: function (req, file, cb) {
    // Membuat nama file unik (TahunBulanTanggal-NamaFileAsli)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. Filter Tipe File (Hanya boleh gambar)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

// 3. Eksekusi Multer (Maksimal ukuran file 5MB)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
