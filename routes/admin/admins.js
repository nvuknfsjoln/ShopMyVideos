// routes/admin/admins.js
const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../middleware/auth');
const { listAdmins, createAdmin, deleteAdmin } = require('../../controllers/adminController');

router.use(requireAdminAuth);

router.get('/', async (req, res) => {
  const admins = await listAdmins();
  res.render('admin/admins', { admins });
});

router.post('/create', async (req, res) => {
  const { email, password } = req.body;
  await createAdmin(email, password);
  res.redirect('/admin/admins');
});

router.post('/delete/:id', async (req, res) => {
  await deleteAdmin(req.params.id);
  res.redirect('/admin/admins');
});

module.exports = router;
