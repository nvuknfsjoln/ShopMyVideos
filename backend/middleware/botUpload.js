function verifyBot(req, res, next) {
    const botToken = req.header('X-BOT-TOKEN');

    if (!botToken || botToken !== process.env.BOT_UPLOAD_TOKEN) {
        return res.status(403).json({ error: 'Unauthorized bot access' });
    }

    next();
}

module.exports = verifyBot;
