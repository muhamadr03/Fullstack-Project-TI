const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middlewares/authMiddleware");
const Joi = require("joi");
const { validate } = require("../middlewares/validator");

const reviewSchema = Joi.object({
  product_id: Joi.number().required(),
  order_id: Joi.number().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow(""),
});
// Publik bisa melihat ulasan
router.get("/:productId", reviewController.getProductReviews);

// Hanya yang login bisa memberi ulasan
router.post("/", verifyToken, validate(reviewSchema), reviewController.addReview);

module.exports = router;