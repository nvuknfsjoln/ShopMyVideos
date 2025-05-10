const AdminLog = require('../models/adminlog');
const Creator = require('../models/creator');
const Voucher = require('../models/voucher');

exports.getDashboard = async (req, res) => {
    try {
        const creators = await Creator.find();
        res.json({ creators });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching dashboard data' });
    }
};

exports.createVoucher = async (req, res) => {
    try {
        const { code, value } = req.body;
        const newVoucher = new Voucher({ code, value });
        await newVoucher.save();
        res.status(201).json(newVoucher);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create voucher' });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find().sort({ createdAt: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};
