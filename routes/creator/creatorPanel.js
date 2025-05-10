const express = require('express');
const router = express.Router();
const creatorPanelController = require('../../controllers/creator/creatorPanelController');

// Creator-Dashboard: Umsätze anzeigen
router.get('/dashboard', creatorPanelController.getDashboard);

// Video erstellen
router.post('/upload', creatorPanelController.uploadVideo);

// Eigene Videos auflisten
router.get('/videos', creatorPanelController.getMyVideos);

// Video bearbeiten (nur eigene)
router.put('/video/:id', creatorPanelController.updateMyVideo);

// Video offline nehmen / online stellen / löschen
router.patch('/video/:id/status', creatorPanelController.changeStatus);
router.delete('/video/:id', creatorPanelController.deleteVideo);

module.exports = router;
