const express = require('express');
const router = express.Router();
const creatorController = require('../../controllers/creatorController');

// Creator registrieren (mit Ü18-Check)
router.post('/register', creatorController.registerCreator);

// Creator einloggen
router.post('/login', creatorController.loginCreator);

// Gutschein beantragen
router.post('/request-voucher', creatorController.requestVoucher);

module.exports = router;
