const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Endpoint ini wajib diproteksi, hanya Admin yang boleh mengakses
router.get(
  "/stats",
  verifyToken,
  isAdmin,
  dashboardController.getDashboardStats,
);

module.exports = router;
