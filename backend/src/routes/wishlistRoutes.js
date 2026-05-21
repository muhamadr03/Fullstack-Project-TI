const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, wishlistController.getUserWishlist);
router.post("/toggle", verifyToken, wishlistController.toggleWishlist);

module.exports = router;
