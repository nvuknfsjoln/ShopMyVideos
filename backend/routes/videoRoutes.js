const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/videoController');
const { verifyCreator, verifyUser } = require('../middleware/authMiddleware');

// Creator routes
router.post('/', verifyCreator, VideoController.uploadVideo);
router.put('/:id', verifyCreator, VideoController.updateVideo);
router.delete('/:id', verifyCreator, VideoController.deleteVideo);

// Public viewing (if unlocked or purchased)
router.get('/:id/stream', verifyUser, VideoController.streamVideo);

module.exports = router;
