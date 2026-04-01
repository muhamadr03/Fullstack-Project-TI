require("dotenv").config();

const express = require("express");
const app = express();
const authRoutes = require("./src/routes/authRoutes"); // Sesuaikan letak foldernya

// WAJIB ADA: Agar Express bisa membaca data JSON dari body request
app.use(express.json());

// Menyambungkan rute autentikasi ke awalan '/api/auth'
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
