// routes/admin/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getAdminByEmail } = require('../../controllers/adminController');

// Login-Seite
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// Login absenden
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await getAdminByEmail(email);

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.render('admin/login', { error: 'Ungültige Zugangsdaten' });
  }

  req.session.adminId = admin._id;
  res.redirect('/admin/dashboard');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;
