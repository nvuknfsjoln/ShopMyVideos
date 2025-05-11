// routes/admin/support.js
const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../middleware/authAdmin');
const { getAllTickets, respondToTicket } = require('../../controllers/supportController');

router.use(requireAdminAuth);

router.get('/', async (req, res) => {
  const tickets = await getAllTickets();
  res.render('admin/support', { tickets });
});

router.post('/respond/:id', async (req, res) => {
  await respondToTicket(req.params.id, req.body.response);
  res.redirect('/admin/support');
});

module.exports = router;
