const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rute untuk mengambil semua produk
// Path dasar (seperti /api/products) biasanya didefinisikan di file utama (misal: app.js atau index.js)
// Sehingga di sini kita cukup menggunakan '/'
router.get('/', productController.getAllProducts);

module.exports = router;