const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Dashboard overview
router.get('/dashboard', verifyAdmin, AdminController.getDashboardStats);

// Manage creator requests
router.get('/creator-requests', verifyAdmin, AdminController.getCreatorRequests);
router.post('/creator-requests/:id/approve', verifyAdmin, AdminController.approveCreatorRequest);
router.post('/creator-requests/:id/reject', verifyAdmin, AdminController.rejectCreatorRequest);

// View logs
router.get('/logs', verifyAdmin, AdminController.getLogs);

module.exports = router;
