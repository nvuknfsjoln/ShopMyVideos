const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');

// Dashboard: Umsätze, Statistiken
router.get('/dashboard', adminController.getDashboard);

// Videos
router.post('/videos/upload', adminController.uploadVideo);
router.get('/videos', adminController.getAllVideos);
router.put('/videos/:id', adminController.updateVideo);
router.patch('/videos/:id/status', adminController.toggleVideoStatus);
router.delete('/videos/:id', adminController.deleteVideo);

// Admin-Verwaltung
router.get('/admins', adminController.getAdmins);
router.put('/admins/:id', adminController.updateAdmin);
router.patch('/admins/:id/status', adminController.toggleAdminStatus);
router.delete('/admins/:id', adminController.deleteAdmin);

// Creator-Bewerbungen
router.get('/creators/applications', adminController.getCreatorApplications);
router.post('/creators/:id/approve', adminController.approveCreator);
router.post('/creators/:id/deny', adminController.denyCreator);

// Creator-Verwaltung
router.get('/creators', adminController.getCreators);
router.put('/creators/:id', adminController.updateCreator);
router.patch('/creators/:id/status', adminController.toggleCreatorStatus);
router.delete('/creators/:id', adminController.deleteCreator);

// Gutscheine
router.post('/vouchers/create', adminController.createVoucher);
router.get('/vouchers', adminController.getAllVouchers);
router.patch('/vouchers/:id/status', adminController.toggleVoucherStatus);
router.delete('/voucher/:id', adminController.deleteVoucher);

// Supportnachrichten
router.get('/support/messages', adminController.getSupportMessages);
router.delete('/support/messages', adminController.deleteMultipleMessages);

module.exports = router;
