const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const Joi = require("joi");
const { validate } = require("../middlewares/validator");

// Aturan membuat/mengubah produk
const productSchema = Joi.object({
  category_id: Joi.number().integer().required(),
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  price: Joi.number().positive().required(), // Harga tidak boleh minus!
  stock: Joi.number().integer().min(0).required(), // Stok minimal 0
  image_url: Joi.string().uri().allow(""),
});

// Rute Publik
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Rute Privat (Hanya Admin)
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validate(productSchema),
  productController.createProduct,
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validate(productSchema),
  productController.updateProduct,
);
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
