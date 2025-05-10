const express = require('express');
const router = express.Router();
const supportController = require('../../controllers/public/supportController');

// Supportnachricht absenden
router.post('/send', supportController.sendMessage);

module.exports = router;
