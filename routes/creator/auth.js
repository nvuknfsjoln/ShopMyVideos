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
  const creator = await getCreatorByEmail(email);

  if (!creator || !(await bcrypt.compare(password, creator.password))) {
    return res.render('creator/login', { error: 'Falsche Zugangsdaten' });
  }

  req.session.creatorId = creator._id;
  res.redirect('/creator/dashboard');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/creator/login');
  });
});

module.exports = router;
