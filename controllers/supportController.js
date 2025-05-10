const SupportMessage = require('../models/SupportMessage');

// Supportnachricht senden
exports.sendSupportMessage = async (req, res) => {
  const { message, email } = req.body;
  try {
    const newMessage = new SupportMessage({ message, email });
    await newMessage.save();
    res.status(201).json({ message: 'Supportnachricht erfolgreich gesendet' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Senden der Nachricht' });
  }
};

// Alle Supportnachrichten anzeigen (für Admins)
exports.getSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der Nachrichten' });
  }
};

// Supportnachricht löschen (Admin-Funktion)
exports.deleteSupportMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    await SupportMessage.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Nachricht erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen der Nachricht' });
  }
};
