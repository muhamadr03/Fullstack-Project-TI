const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Semua rute alamat harus login
router.get("/", verifyToken, addressController.getUserAddresses);
router.post("/", verifyToken, addressController.addAddress);
router.delete("/:id", verifyToken, addressController.deleteAddress);

module.exports = router;
