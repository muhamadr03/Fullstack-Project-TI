require("dotenv").config();
const express = require("express");
const app = express();

// 1. MIDDLEWARE (Wajib di paling atas sebelum routes)
app.use(express.json());

// 2. IMPORT ROUTES
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

// 3. MOUNT ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); // Pastikan ini /api/cart

// 4. JALANKAN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
