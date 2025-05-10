const Video = require('../models/Video');
const Category = require('../models/Category');

// Videos anzeigen (beliebteste Videos)
exports.getPopularVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 }).limit(10);
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der beliebten Videos' });
  }
};

// Videos nach Kategorien oder Titel suchen
exports.searchVideos = async (req, res) => {
  const { query } = req.query;
  try {
    const videos = await Video.find({
      $text: { $search: query }
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei der Videosuche' });
  }
};

// Videos nach Kategorien filtern
exports.filterVideos = async (req, res) => {
  const { categories, free, length } = req.body; // Beispielhafte Filterparameter
  try {
    const filterQuery = {};
    if (categories) {
      filterQuery.category = { $in: categories };
    }
    if (free) {
      filterQuery.price = { $eq: 0 };
    }
    if (length) {
      filterQuery.length = { $lte: length };
    }
    const videos = await Video.find(filterQuery);
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Anwenden der Filter' });
  }
};

// Video durch Klick öffnen
exports.viewVideo = async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video nicht gefunden' });
    }
    video.views += 1; // Views aktualisieren
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden des Videos' });
  }
};
