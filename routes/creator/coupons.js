// routes/creator/coupons.js
const express = require('express');
const router = express.Router();
const { requireCreatorAuth } = require('../../middleware/auth');
const { listCoupons, createCoupon, deleteCoupon } = require('../../controllers/couponController');

// Middleware: nur eingeloggt
router.use(requireCreatorAuth);

// Alle Coupons anzeigen
router.get('/', async (req, res) => {
  const coupons = await listCoupons(req.session.creatorId);
  res.render('creator/coupons', { coupons });
});

// Neuen Coupon erstellen
router.post('/create', async (req, res) => {
  const { code, discount } = req.body;
  await createCoupon(req.session.creatorId, code, discount);
  res.redirect('/creator/coupons');
});

// Coupon löschen
router.post('/delete/:id', async (req, res) => {
  await deleteCoupon(req.params.id, req.session.creatorId);
  res.redirect('/creator/coupons');
});

module.exports = router;
