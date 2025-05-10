const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getProfile);

module.exports = router;
