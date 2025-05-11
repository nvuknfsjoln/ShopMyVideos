const Admin = require('../models/Admin');
const Video = require('../models/Video');
const Creator = require('../models/Creator');
const Coupon = require('../models/Voucher');

// Admin-Login
exports.loginAdmin = async (req, res) => {
  const { adminName, adminPassword } = req.body;
  try {
    const admin = await Admin.findOne({ adminName, adminPassword });
    if (!admin) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }
    res.status(200).json({ message: 'Erfolgreich eingeloggt' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Login' });
  }
};

// Admin erstellen
exports.createAdmin = async (req, res) => {
  const { adminName, adminPassword } = req.body;
  try {
    const newAdmin = new Admin({ adminName, adminPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin erfolgreich erstellt' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Admins' });
  }
};

// Alle Admins anzeigen
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der Admins' });
  }
};

// Video bearbeiten
exports.updateVideo = async (req, res) => {
  const { videoId } = req.params;
  const { title, price, categories } = req.body;
  try {
    const video = await Video.findByIdAndUpdate(videoId, { title, price, categories }, { new: true });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Bearbeiten des Videos' });
  }
};
