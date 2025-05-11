const express = require('express');
const router = express.Router();
const supportController = require('../../controllers/supportController');

// Supportnachricht absenden
router.post('/send', supportController.sendSupportMessage);

module.exports = router;
