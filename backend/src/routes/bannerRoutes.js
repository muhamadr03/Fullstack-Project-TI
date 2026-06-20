const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', bannerController.getAllBanners);
router.post('/', verifyToken, isAdmin, upload.single('image'), bannerController.createBanner);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), bannerController.updateBanner);
router.delete('/:id', verifyToken, isAdmin, bannerController.deleteBanner);

module.exports = router;
