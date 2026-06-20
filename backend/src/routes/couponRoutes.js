const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/validate', verifyToken, couponController.validateCoupon);
router.get('/', verifyToken, isAdmin, couponController.getAllCoupons);
router.post('/', verifyToken, isAdmin, couponController.createCoupon);
router.put('/:id', verifyToken, isAdmin, couponController.updateCoupon);
router.delete('/:id', verifyToken, isAdmin, couponController.deleteCoupon);

module.exports = router;
