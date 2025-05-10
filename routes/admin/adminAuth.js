const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/adminAuthController');

// Admin einloggen
router.post('/login', adminAuthController.loginAdmin);

// Neuen Admin erstellen (nur mit Adminrechten)
router.post('/create', adminAuthController.createAdmin);

// Admin-Aktion bestätigen (für z. B. Löschungen etc.)
router.post('/verify', adminAuthController.verifyAdminAccess);

module.exports = router;
