const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Publik bisa melihat ulasan
router.get("/:productId", reviewController.getProductReviews);

// Hanya yang login bisa memberi ulasan
router.post("/", verifyToken, reviewController.addReview);

module.exports = router;
