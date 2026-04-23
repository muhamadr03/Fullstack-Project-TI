const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const Joi = require("joi");
const { validate } = require("../middlewares/validator");

// Skema validasi khusus update status oleh Admin
const statusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "shipped", "completed", "cancelled")
    .required(),
  tracking_number: Joi.string().allow("").optional(),
});

// Rute untuk Customer Biasa
router.post("/checkout", verifyToken, orderController.checkout);
router.get("/my-orders", verifyToken, orderController.getUserOrders);

// Rute khusus Admin
router.put(
  "/:id/status",
  verifyToken,
  isAdmin,
  validate(statusSchema),
  orderController.updateOrderStatus,
);

module.exports = router;
