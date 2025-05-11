// routes/client/video.js
const express = require('express');
const router = express.Router();
const { getVideoById, handlePayment } = require('../../controllers/videoController');
const { checkAgeCookie } = require('../../controllers/shopController');

// Video ansehen (Zahlungsauswahl)
router.get('/:id', checkAgeCookie, async (req, res) => {
  const video = await getVideoById(req.params.id);
  if (!video) {
    return res.status(404).render('shop/not-found');
  }
  res.render('shop/video-payment', { video });
});

// Bezahlung bestätigen
router.post('/:id/confirm', checkAgeCookie, async (req, res) => {
  const result = await handlePayment(req.params.id, req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }

  res.render('shop/video-player', { videoUrl: result.videoUrl });
});

module.exports = router;
