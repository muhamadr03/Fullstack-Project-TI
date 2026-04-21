const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

// 🚨 PENTING: Rute ini JANGAN diberi verifyToken atau isAdmin!
// Karena yang menembak rute ini adalah server Midtrans, bukan pembeli/admin.
router.post("/midtrans", webhookController.midtransNotification);

module.exports = router;
