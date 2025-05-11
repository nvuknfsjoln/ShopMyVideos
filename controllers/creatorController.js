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

// Dashboard (z. B. Videoanzahl und Einnahmen)
exports.getDashboard = async (req, res) => {
  const { creatorName } = req.query;
  try {
    const videos = await Video.find({ creatorName });
    const totalEarnings = videos.reduce((sum, v) => sum + (v.price || 0), 0);
    res.status(200).json({
      videoCount: videos.length,
      totalEarnings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden des Dashboards' });
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

// Eigene Videos anzeigen
exports.getMyVideos = async (req, res) => {
  const { creatorName } = req.query;
  try {
    const videos = await Video.find({ creatorName });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der Videos' });
  }
};

// Video bearbeiten
exports.updateMyVideo = async (req, res) => {
  const { id } = req.params;
  const { title, price, categories } = req.body;
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, price, categories },
      { new: true }
    );
    res.status(200).json({ message: 'Video aktualisiert', video: updatedVideo });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Videos' });
  }
};

// Video-Status ändern (z. B. online/offline setzen)
exports.changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Beispiel: { status: "online" }
  try {
    const video = await Video.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: 'Status aktualisiert', video });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Ändern des Status' });
  }
};

// Video löschen
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndDelete(id);
    res.status(200).json({ message: 'Video gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Videos' });
  }
};
