// routes/admin/creators.js
const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../middleware/auth');
const { listCreators, deleteCreator } = require('../../controllers/creatorController');

router.use(requireAdminAuth);

router.get('/', async (req, res) => {
  const creators = await listCreators();
  res.render('admin/creators', { creators });
});

router.post('/delete/:id', async (req, res) => {
  await deleteCreator(req.params.id);
  res.redirect('/admin/creators');
});

module.exports = router;
