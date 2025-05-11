// routes/client/shop.js
const express = require('express');
const router = express.Router();
const { checkAgeCookie, loadVideos, filterVideos, searchVideos, checkCoupon } = require('../../controllers/shopController');
// routes/client/shop.js
const ageCheck = require('../../middleware/ageCheck');

router.get('/shop', ageCheck, (req, res) => {
    // Shop-Logik hier
});

// Altersabfrage
router.get('/age-check', (req, res) => {
  res.render('age-check');
});

// Setzt Alterscookie und leitet weiter
router.post('/age-confirm', (req, res) => {
  res.cookie('isAdult', 'true', { maxAge: 1000 * 60 * 60 * 24 * 30 }); // 30 Tage gültig
  res.redirect('/');
});

// routes/client/shop.js
router.post('/verify-age', (req, res) => {
    const age = parseInt(req.body.age, 10);
    if (age >= 18) {
        res.cookie('ageVerified', true, { maxAge: 24 * 60 * 60 * 1000 }); // 1 Tag gültig
        res.redirect('/shop');
    } else {
        res.send('Zugriff verweigert: Sie müssen mindestens 18 Jahre alt sein.');
    }
});

// Startseite
router.get('/', checkAgeCookie, async (req, res) => {
  const videos = await loadVideos(); // Top Videos laden
  res.render('shop/index', { videos });
});

// Suche
router.get('/search', checkAgeCookie, async (req, res) => {
  const query = req.query.q;
  const videos = await searchVideos(query);
  res.render('shop/search', { videos, query });
});

// Filter
router.post('/filter', checkAgeCookie, async (req, res) => {
  const filters = req.body;
  const videos = await filterVideos(filters);
  res.render('shop/filter', { videos });
});

// Gutscheincode prüfen
router.post('/check-coupon', async (req, res) => {
  const { code } = req.body;
  const result = await checkCoupon(code);
  res.json(result);
});

// Supportnachricht
router.post('/support', async (req, res) => {
  const { message } = req.body;
  // Speichere Nachricht in der DB (Support-Tabelle)
  await req.db.collection('supportMessages').insertOne({
    message,
    timestamp: new Date()
  });
  res.json({ success: true });
});

module.exports = router;
