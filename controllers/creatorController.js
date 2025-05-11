const Creator = require('../models/Creator');
const Video = require('../models/Video');
const Voucher = require('../models/Voucher'); // Wichtig: Modell importieren

exports.requestVoucher = async (req, res) => {
  const { creatorName, code, discount } = req.body;
  try {
    const existing = await Voucher.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Gutscheincode existiert bereits' });

    const voucher = new Voucher({
      code,
      discount,
      isCreatorVoucher: true,
      creatorName,
      requested: true,
      valid: false
    });
    await voucher.save();
    res.status(201).json({ message: 'Gutscheinanfrage eingereicht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei Gutscheinanfrage' });
  }
};

exports.setAdminVoucherPreference = async (req, res) => {
  const { creatorName, allowAdminVouchers } = req.body;
  try {
    await Creator.findOneAndUpdate({ creatorName }, { allowAdminVouchers });
    res.status(200).json({ message: 'Einstellung aktualisiert' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren der Einstellung' });
  }
};

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
      return res.status(400).json({ message: 'UngÃ¼ltige Anmeldedaten' });
    }
    res.status(200).json({ message: 'Erfolgreich eingeloggt' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Login' });
  }
};

// Dashboard
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

// Video-Status Ã¤ndern
exports.changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const video = await Video.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: 'Status aktualisiert', video });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Ãndern des Status' });
  }
};

// Video lÃ¶schen
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndDelete(id);
    res.status(200).json({ message: 'Video gelÃ¶scht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim LÃ¶schen des Videos' });
  }
};

// =======================
// GUTSCHEIN FUNKTIONEN
// =======================

// Gutschein erstellen (nur fÃ¼r Creator)
exports.requestVoucher = async (req, res) => {
  const { code, discount, creatorName } = req.body;
  try {
    const existing = await Voucher.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Gutscheincode bereits vergeben' });
    }
    const newVoucher = new Voucher({ code, discount, creatorName });
    await newVoucher.save();
    res.status(201).json({ message: 'Gutschein erstellt', voucher: newVoucher });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Gutscheins' });
  }
};

// Gutschein einlÃ¶sen (z.â¯B. durch Nutzer beim Kauf)
exports.redeemVoucher = async (req, res) => {
  const { code } = req.body;
  try {
    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      return res.status(404).json({ message: 'Gutschein nicht gefunden' });
    }
    res.status(200).json({ message: 'Gutschein gÃ¼ltig', discount: voucher.discount });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim EinlÃ¶sen des Gutscheins' });
  }
};
