const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Rute untuk Customer Biasa
router.post("/checkout", verifyToken, orderController.checkout);
router.get("/my-orders", verifyToken, orderController.getUserOrders);

// Rute khusus Admin
router.put(
  "/:id/status",
  verifyToken,
  isAdmin,
  orderController.updateOrderStatus,
);

module.exports = router;
