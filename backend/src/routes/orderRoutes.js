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
  courier: Joi.string().allow("").optional(),
});

// Rute untuk Customer Biasa
router.post("/checkout", verifyToken, orderController.checkout);
router.get("/my-orders", verifyToken, orderController.getUserOrders);
router.patch("/:id/complete", verifyToken, orderController.completeOrder);
router.post("/:id/cancel-request", verifyToken, orderController.requestCancellation);
router.post("/:id/verify-payment", verifyToken, orderController.verifyPayment);


// Rute khusus Admin
router.put(
  "/:id/status",
  verifyToken,
  isAdmin,
  validate(statusSchema),
  orderController.updateOrderStatus,
);

router.get("/", verifyToken, isAdmin, orderController.getAllOrders);
router.patch("/:id/cancellation", verifyToken, isAdmin, orderController.handleCancellationRequest);

module.exports = router;
