const express = require('express');
const router = express.Router();
const creatorController = require('../../controllers/creatorController');

// Creator registrieren / Login
router.post('/register', creatorController.registerCreator);
router.post('/login', creatorController.loginCreator);

// Dashboard und Video
router.get('/dashboard', creatorController.getDashboard);
router.get('/my-videos', creatorController.getMyVideos);
router.post('/upload', creatorController.uploadVideo);
router.put('/video/:id', creatorController.updateMyVideo);
router.put('/status/:id', creatorController.changeStatus);
router.delete('/video/:id', creatorController.deleteVideo);

// Gutschein beantragen
router.post('/request-voucher', creatorController.requestVoucher);

// Admin-Gutscheinverwendung einstellen
router.post('/allow-admin-vouchers', creatorController.setAdminVoucherPreference);

module.exports = router;
