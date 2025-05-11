const Creator = require('../models/Creator');
const Video = require('../models/Video');
const Voucher = require('../models/Voucher');

// (bereits vorhandene Funktionen ausgelassen)

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
