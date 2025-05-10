function creatorOnly(req, res, next) {
    if (!req.user || req.user.role !== 'creator') {
        return res.status(403).json({ error: 'Creator access required' });
    }
    next();
}

module.exports = creatorOnly;
