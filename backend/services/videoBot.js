const Video = require('../models/video');
const User = require('../models/user');

async function recommendVideos(userId) {
    const user = await User.findById(userId);
    if (!user) return [];

    const purchased = user.purchasedVideos || [];

    // Recommend videos not purchased yet
    const recommended = await Video.find({ _id: { $nin: purchased } })
        .limit(5)
        .sort({ createdAt: -1 });

    return recommended;
}

module.exports = { recommendVideos };
