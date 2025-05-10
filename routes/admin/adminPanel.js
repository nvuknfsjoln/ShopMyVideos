const express = require('express');
const router = express.Router();
const adminPanelController = require('../../controllers/admin/adminPanelController');

// Dashboard: Umsätze, Statistiken
router.get('/dashboard', adminPanelController.getDashboard);

// Videos
router.post('/videos/upload', adminPanelController.uploadVideo);
router.get('/videos', adminPanelController.getAllVideos);
router.put('/videos/:id', adminPanelController.updateVideo);
router.patch('/videos/:id/status', adminPanelController.toggleVideoStatus);
router.delete('/videos/:id', adminPanelController.deleteVideo);

// Admin-Verwaltung
router.get('/admins', adminPanelController.getAdmins);
router.put('/admins/:id', adminPanelController.updateAdmin);
router.patch('/admins/:id/status', adminPanelController.toggleAdminStatus);
router.delete('/admins/:id', adminPanelController.deleteAdmin);

// Creator-Bewerbungen
router.get('/creators/applications', adminPanelController.getCreatorApplications);
router.post('/creators/:id/approve', adminPanelController.approveCreator);
router.post('/creators/:id/deny', adminPanelController.denyCreator);

// Creator-Verwaltung
router.get('/creators', adminPanelController.getCreators);
router.put('/creators/:id', adminPanelController.updateCreator);
router.patch('/creators/:id/status', adminPanelController.toggleCreatorStatus);
router.delete('/creators/:id', adminPanelController.deleteCreator);

// Gutscheine
router.post('/coupons/create', adminPanelController.createCoupon);
router.get('/coupons', adminPanelController.getAllCoupons);
router.patch('/coupons/:id/status', adminPanelController.toggleCouponStatus);
router.delete('/coupons/:id', adminPanelController.deleteCoupon);

// Supportnachrichten
router.get('/support/messages', adminPanelController.getSupportMessages);
router.delete('/support/messages', adminPanelController.deleteMultipleMessages);

module.exports = router;
