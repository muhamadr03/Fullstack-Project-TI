require("dotenv").config();

const express = require("express");
const app = express();
const authRoutes = require("./src/routes/authRoutes"); // Sesuaikan letak foldernya
const productRoutes = require("./src/routes/productRoutes"); // Sesuaikan letak foldernya

// WAJIB ADA: Agar Express bisa membaca data JSON dari body request
app.use(express.json());

// Menyambungkan rute autentikasi ke awalan '/api/auth'
app.use("/api/auth", authRoutes);

// Menyambungkan rute produk ke awalan '/api/products'
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
