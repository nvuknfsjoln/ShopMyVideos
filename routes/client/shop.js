const express = require('express');
const router = express.Router();
const {
  checkCoupon,
  loadVideos,
  searchVideos,
  filterVideos
} = require('../../controllers/shopController');

const ageCheck = require('../../middleware/ageCheck');

// Altersabfrage-Formular
router.get('/age-check', (req, res) => {
  res.render('age-check');
});

// Altersprüfung: setzt Session und optional Cookie
router.post('/verify-age', (req, res) => {
  const age = parseInt(req.body.age, 10);
  if (age >= 18) {
    req.session.isAdult = true;
    res.cookie('isAdult', 'true', { maxAge: 1000 * 60 * 60 * 24 * 30 }); // optional
    return res.redirect('/shop');
  } else {
    return res.send('Zugriff verweigert: Sie müssen mindestens 18 Jahre alt sein.');
  }
});

// Shopseite (nur wenn Alter bestätigt)
router.get('/shop', ageCheck, async (req, res) => {
  const videos = await loadVideos();
  res.render('shop/index', { videos });
});

// Startseite (auch geschützt)
router.get('/', ageCheck, async (req, res) => {
  const videos = await loadVideos();
  res.render('shop/index', { videos });
});

// Suche
router.get('/search', ageCheck, async (req, res) => {
  const query = req.query.q;
  const videos = await searchVideos(query);
  res.render('shop/search', { videos, query });
});

// Filter
router.post('/filter', ageCheck, async (req, res) => {
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
  await req.db.collection('supportMessages').insertOne({
    message,
    timestamp: new Date()
  });
  res.json({ success: true });
});

module.exports = router;
