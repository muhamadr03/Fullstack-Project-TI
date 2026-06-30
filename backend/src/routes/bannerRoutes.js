const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Dual image upload: 'image' (background) + 'product_image' (right-side product)
const bannerUpload = upload.fields([
  { name: 'image',         maxCount: 1 },
  { name: 'product_image', maxCount: 1 },
]);

router.get('/',    bannerController.getAllBanners);
router.post('/',   verifyToken, isAdmin, bannerUpload, bannerController.createBanner);
router.put('/:id', verifyToken, isAdmin, bannerUpload, bannerController.updateBanner);
router.delete('/:id', verifyToken, isAdmin, bannerController.deleteBanner);

module.exports = router;
