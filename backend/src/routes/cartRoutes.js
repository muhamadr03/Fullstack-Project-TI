const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/authMiddleware");
const Joi = require("joi");
const { validate } = require("../middlewares/validator");

const cartSchema = Joi.object({
  product_id: Joi.number().required(),
  quantity: Joi.number().integer().min(1).required(), // Tidak boleh beli 0 atau minus
});

// Semua rute keranjang WAJIB login (verifyToken), tapi tidak perlu Admin
router.get("/", verifyToken, cartController.getCart);
router.post("/", verifyToken, validate(cartSchema), cartController.addToCart);
router.delete("/:id", verifyToken, cartController.removeFromCart);

module.exports = router;