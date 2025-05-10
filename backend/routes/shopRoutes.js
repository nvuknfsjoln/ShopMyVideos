const express = require('express');
const router = express.Router();
const ShopController = require('../controllers/shopController');
const { verifyUser } = require('../middleware/authMiddleware');

// Public video browsing
router.get('/videos', ShopController.listAllVideos);
router.get('/videos/:id', ShopController.getVideoDetails);

// Purchase video
router.post('/videos/:id/purchase', verifyUser, ShopController.purchaseVideo);

// Redeem voucher
router.post('/voucher/redeem', verifyUser, ShopController.redeemVoucher);

module.exports = router;
