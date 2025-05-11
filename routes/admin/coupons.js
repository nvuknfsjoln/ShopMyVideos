// routes/admin/coupons.js
const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../middleware/authAdmin');
const { listAllCoupons, deleteCoupon } = require('../../controllers/couponController');

router.use(requireAdminAuth);

router.get('/', async (req, res) => {
  const coupons = await listAllCoupons();
  res.render('admin/coupons', { coupons });
});

router.post('/delete/:id', async (req, res) => {
  await deleteCoupon(req.params.id);
  res.redirect('/admin/coupons');
});

module.exports = router;
