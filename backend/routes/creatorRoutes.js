const express = require('express');
const router = express.Router();
const Creator = require('../models/creator');
const Video = require('../models/video');
const { verifyCreatorToken } = require('../middleware/auth');

// GET: Creator-Profil abrufen
router.get('/me', verifyCreatorToken, async (req, res) => {
  try {
    const creator = await Creator.findById(req.user.id).populate('videos');
    if (!creator) return res.status(404).json({ message: 'Creator not found' });
    res.json(creator);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT: Creator-Profil aktualisieren
router.put('/update', verifyCreatorToken, async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Creator.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err });
  }
});

// POST: Neues Video hochladen
router.post('/videos', verifyCreatorToken, async (req, res) => {
  try {
    const { title, description, price, videoUrl, thumbnailUrl, tags } = req.body;

    const newVideo = new Video({
      creator: req.user.id,
      title,
      description,
      price,
      videoUrl,
      thumbnailUrl,
      tags,
    });

    await newVideo.save();
    await Creator.findByIdAndUpdate(req.user.id, { $push: { videos: newVideo._id } });

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading video', error: err });
  }
});

// GET: Eigene Videos abrufen
router.get('/videos', verifyCreatorToken, async (req, res) => {
  try {
    const videos = await Video.find({ creator: req.user.id });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching videos', error: err });
  }
});

// DELETE: Video löschen
router.delete('/videos/:id', verifyCreatorToken, async (req, res) => {
  try {
    const video = await Video.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
    if (!video) return res.status(404).json({ message: 'Video not found or unauthorized' });

    await Creator.findByIdAndUpdate(req.user.id, { $pull: { videos: req.params.id } });
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting video', error: err });
  }
});

module.exports = router;
