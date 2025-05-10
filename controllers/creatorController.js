const Creator = require('../models/Creator');
const Video = require('../models/Video');

// Creator anmelden
exports.registerCreator = async (req, res) => {
  const { creatorName, creatorPassword, email } = req.body;
  try {
    const creatorExists = await Creator.findOne({ creatorName });
    if (creatorExists) {
      return res.status(400).json({ message: 'Creator-Name bereits vergeben' });
    }
    const newCreator = new Creator({ creatorName, creatorPassword, email });
    await newCreator.save();
    res.status(201).json({ message: 'Creator erfolgreich registriert' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei der Registrierung des Creators' });
  }
};

// Creator-Login
exports.loginCreator = async (req, res) => {
  const { creatorName, creatorPassword } = req.body;
  try {
    const creator = await Creator.findOne({ creatorName, creatorPassword });
    if (!creator) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }
    res.status(200).json({ message: 'Erfolgreich eingeloggt' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Login' });
  }
};

// Video hochladen
exports.uploadVideo = async (req, res) => {
  const { title, price, categories, creatorName } = req.body;
  try {
    const newVideo = new Video({ title, price, categories, creatorName });
    await newVideo.save();
    res.status(201).json({ message: 'Video erfolgreich hochgeladen' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Hochladen des Videos' });
  }
};

// Videos des Creators anzeigen
exports.getCreatorVideos = async (req, res) => {
  const { creatorName } = req.params;
  try {
    const videos = await Video.find({ creatorName });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der Videos' });
  }
};
