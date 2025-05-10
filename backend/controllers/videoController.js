const Video = require('../models/video');

exports.getAll = async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Could not retrieve videos' });
    }
};

exports.getById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json(video);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch video' });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json({ message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete video' });
    }
};
