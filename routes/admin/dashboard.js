// routes/admin/dashboard.js

const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../middleware/authAdmin');
const { getDashboardStats } = require('../../controllers/adminController');

router.use(requireAdminAuth);

router.get('/', async (req, res) => {
  const stats = await getDashboardStats();
  res.render('admin/dashboard', { stats });
});

module.exports = router;
