const Video = require('../models/Video');
const Category = require('../models/Category');
const Coupon = require('../models/Voucher'); // Falls du Coupon-Codes nutzt

// === Produkte anzeigen ===
exports.getAllProducts = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der Produkte' });
  }
};

// === Beliebteste Videos anzeigen ===
exports.getPopularVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 }).limit(10);
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der beliebten Videos' });
  }
};

// === Suche nach Titeln, Creatornamen etc. ===
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

// === Videos filtern ===
exports.getFilteredVideos = async (req, res) => {
  const { categories, free, length } = req.body;
  try {
    const filterQuery = {};
    if (categories) {
      filterQuery.category = { $in: categories };
    }
    if (free !== undefined) {
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

// === Video-Details abrufen ===
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video nicht gefunden' });
    }
    video.views += 1;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden des Videos' });
  }
};

// === Altersfreigabe prüfen ===
exports.getAgeCheck = (req, res) => {
  // Beispiel: Alter aus Query prüfen
  const { age } = req.query;
  if (age >= 18) {
    res.status(200).json({ allowed: true });
  } else {
    res.status(200).json({ allowed: false });
  }
};

// === Gutscheincode prüfen ===
exports.checkVoucher = async (req, res) => {
  const { code } = req.body;
  try {
    const voucher = await Voucher.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Ungültiger Gutscheincode' });
    }
    res.status(200).json({ valid: true, discount: voucher.discount });
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei der Gutscheinprüfung' });
  }
};
