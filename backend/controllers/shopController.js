const Video = require('../models/video');
const Voucher = require('../models/voucher');

exports.listVideos = async (req, res) => {
    try {
        const videos = await Video.find({ isPublic: true });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load videos' });
    }
};

exports.redeemVoucher = async (req, res) => {
    try {
        const { code } = req.body;
        const voucher = await Voucher.findOne({ code });
        if (!voucher) return res.status(404).json({ error: 'Invalid voucher' });

        // Example logic:
        res.json({ discount: voucher.value });
    } catch (err) {
        res.status(500).json({ error: 'Redemption failed' });
    }
};
