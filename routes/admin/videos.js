// routes/admin/videos.js
const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../middleware/authAdmin');
const { listAllVideos, deleteVideo } = require('../../controllers/videoController');

router.use(requireAdminAuth);

router.get('/', async (req, res) => {
  const videos = await listAllVideos();
  res.render('admin/videos', { videos });
});

router.post('/delete/:id', async (req, res) => {
  await deleteVideo(req.params.id);
  res.redirect('/admin/videos');
});

module.exports = router;
