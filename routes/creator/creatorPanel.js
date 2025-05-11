const express = require('express');
const router = express.Router();
const creatorController = require('../../controllers/creatorController');

// Creator-Dashboard: Umsätze anzeigen
router.get('/dashboard', creatorController.getDashboard);

// Video erstellen
router.post('/upload', creatorController.uploadVideo);

// Eigene Videos auflisten
router.get('/videos', creatorController.getMyVideos);

// Video bearbeiten (nur eigene)
router.put('/video/:id', creatorController.updateMyVideo);

// Video offline nehmen / online stellen / löschen
router.patch('/video/:id/status', creatorController.changeStatus);
router.delete('/video/:id', creatorController.deleteVideo);

module.exports = router;
