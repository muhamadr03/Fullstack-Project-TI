const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rute publik (boleh diakses semua user)
router.get('/', productController.getAllProducts);

// Contoh rute yang diproteksi admin
router.post('/', adminMiddleware, productController.createProduct);
router.put('/:id', adminMiddleware, productController.updateProduct);
router.delete('/:id', adminMiddleware, productController.deleteProduct);

console.log(productController);

module.exports = router;