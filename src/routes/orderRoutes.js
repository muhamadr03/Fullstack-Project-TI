const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Endpoint: GET /api/orders/:user_id
router.get("/:user_id", orderController.getOrdersByUserId);

module.exports = router;