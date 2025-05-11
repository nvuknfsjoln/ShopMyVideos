// routes/creator/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getCreatorByEmail } = require('../../controllers/creatorController');

// Login-Seite
router.get('/login', (req, res) => {
  res.render('creator/login');
});

// Login absenden
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash('error_msg', 'Benutzer nicht gefunden');
    return res.redirect('/creator/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash('error_msg', 'Passwort falsch');
    return res.redirect('/creator/login');
  }

  req.session.user = user;

  if (user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }

  res.redirect('/creator/dashboard');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/creator/login');
  });
});

module.exports = router;
