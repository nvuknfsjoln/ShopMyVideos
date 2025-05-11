// routes/creator/dashboard.js
const express = require('express');
const router = express.Router();
const { requireCreatorAuth } = require('../../middleware/auth');
const { getVideosByCreator, uploadVideo, deleteVideo } = require('../../controllers/creatorController');

// Middleware: nur eingeloggt
router.use(requireCreatorAuth);

// Dashboard Übersicht
router.get('/', async (req, res) => {
  const videos = await getVideosByCreator(req.session.creatorId);
  res.render('creator/dashboard', { videos });
});

// Video hochladen
router.post('/upload', async (req, res) => {
  const videoData = {
    title: req.body.title,
    file: req.body.file,
    creatorId: req.session.creatorId
  };
  await uploadVideo(videoData);
  res.redirect('/creator/dashboard');
});

// Video löschen
router.post('/delete/:id', async (req, res) => {
  await deleteVideo(req.params.id, req.session.creatorId);
  res.redirect('/creator/dashboard');
});

module.exports = router;
