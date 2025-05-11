// middleware/videoSecurity.js
const Video = require('../models/Video');

module.exports = async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return res.status(404).send('Video nicht gefunden');
  }

  // Erlaubt nur dem Ersteller oder einem Admin Zugriff
  const isOwner = req.session.creatorId && video.creator.toString() === req.session.creatorId;
  const isAdmin = !!req.session.adminId;

  if (isOwner || isAdmin) {
    return next();
  }

  res.status(403).send('Zugriff verweigert');
};
