require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// Inisialisasi Telegram Bot (polling mode)
require("./src/config/telegram");

// Konfigurasi CORS — izinkan frontend URL dari env + localhost dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} tidak diizinkan`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// IMPORT ROUTES
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const addressRoutes = require("./src/routes/addressRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const couponRoutes = require('./src/routes/couponRoutes');
const userRoutes = require('./src/routes/userRoutes');
const bannerRoutes = require('./src/routes/bannerRoutes');

// MOUNT ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);

const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);
// JALANKAN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
