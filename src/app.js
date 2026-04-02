const path = require("path");
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");

const cartRoutes = require("./routes/cartRoutes");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// Middleware untuk membaca JSON
app.use(express.json());

// Gunakan route yang sudah dibuat
app.use("/api/auth", authRoutes);

app.use("/api/cart", cartRoutes);
app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
