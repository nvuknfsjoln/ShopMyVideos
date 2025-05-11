const express = require('express');
const router = express.Router();
const shopController = require('../../controllers/shopController');

// Produkte abrufen
router.get('/products', shopController.getAllProducts);

// Altersfreigabe anzeigen
router.get('/age-check', shopController.getAgeCheck);

// Beliebte Videos
router.get('/popular', shopController.getPopularVideos);

// Suche nach Titeln, Kategorien, Creatornamen
router.get('/search', shopController.searchVideos);

// Video-Details abrufen
router.get('/video/:id', shopController.getVideoById);

// Gutscheincode prüfen
router.post('/check-voucher', shopController.checkVoucher);

// Videos nach Filtern abrufen
router.post('/filter', shopController.getFilteredVideos);

module.exports = router;
