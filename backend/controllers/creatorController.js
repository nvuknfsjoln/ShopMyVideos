const Video = require('../models/video');
const Creator = require('../models/creator');

exports.getProfile = async (req, res) => {
    try {
        const creator = await Creator.findById(req.user.id);
        res.json(creator);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load profile' });
    }
};

exports.uploadVideo = async (req, res) => {
    try {
        const video = new Video({ ...req.body, creatorId: req.user.id });
        await video.save();
        res.status(201).json(video);
    } catch (err) {
        res.status(500).json({ error: 'Failed to upload video' });
    }
};

exports.myVideos = async (req, res) => {
    try {
        const videos = await Video.find({ creatorId: req.user.id });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch videos' });
    }
};
