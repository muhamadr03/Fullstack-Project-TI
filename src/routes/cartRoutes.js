const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


// Endpoint: POST /api/cart
router.post('/cart', cartController.addToCart);
router.get('/test', (req, res) => {
  res.send('Cart route aktif');
});
module.exports = router;