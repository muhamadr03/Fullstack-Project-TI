const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Rute Publik (Bisa diakses siapa saja)
router.get("/", categoryController.getAllCategories);

// Rute Privat (Hanya Admin yang punya token)
router.post("/", verifyToken, isAdmin, upload.single("image"), categoryController.createCategory);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), categoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
