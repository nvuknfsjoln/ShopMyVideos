const Voucher = require('../models/Voucher');

// Alle Gutscheine abrufen
exports.getAllVouchers = async (req, res) => {
  try {
    const regularVouchers = await Voucher.find({ isCreatorVoucher: false });
    const creatorVouchers = await Voucher.find({ isCreatorVoucher: true });
    res.status(200).json({ regularVouchers, creatorVouchers });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der Gutscheine' });
  }
};

// Gutschein freigeben
exports.approveCreatorVoucher = async (req, res) => {
  const { code } = req.body;
  try {
    await Voucher.findOneAndUpdate({ code }, { valid: true, requested: false });
    res.status(200).json({ message: 'Gutschein genehmigt' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei Genehmigung' });
  }
};
