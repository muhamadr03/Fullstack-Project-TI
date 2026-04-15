const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Semua rute keranjang WAJIB login (verifyToken), tapi tidak perlu Admin
router.get("/", verifyToken, cartController.getCart);
router.post("/", verifyToken, cartController.addToCart);
router.delete("/:id", verifyToken, cartController.removeFromCart);

module.exports = router;
