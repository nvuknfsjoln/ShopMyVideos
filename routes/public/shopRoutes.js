const express = require('express');
const router = express.Router();
const shopController = require('../../controllers/shopController');

router.get('/products', getAllProducts); // <== HIER passiert der Fehler!

module.exports = router;

// Altersfreigabe anzeigen
router.get('/age-check', shopController.getAgeCheck);

// Beliebte Videos
router.get('/popular', shopController.getPopularVideos);

// Suche nach Titeln, Kategorien, Creatornamen
router.get('/search', shopController.searchVideos);

// Video-Details abrufen
router.get('/video/:id', shopController.getVideoById);

// Gutscheincode prüfen
router.post('/check-coupon', shopController.checkCoupon);

// Videos nach Filtern abrufen
router.post('/filter', shopController.getFilteredVideos);

module.exports = router;
