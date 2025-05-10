const express = require('express');
const router = express.Router();
const creatorAuthController = require('../../controllers/creator/creatorAuthController');

// Creator registrieren (mit Ü18-Check)
router.post('/register', creatorAuthController.registerCreator);

// Creator einloggen
router.post('/login', creatorAuthController.loginCreator);

// Gutschein beantragen
router.post('/request-coupon', creatorAuthController.requestCoupon);

module.exports = router;
