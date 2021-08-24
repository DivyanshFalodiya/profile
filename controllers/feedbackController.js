const Feedback = require('../models/FeedbackModel');

// Fetch all feeds
async function fetchFeeds() {
    try {
        const data = await Feedback.find({}).sort('-createdAt');
        return data;
    } catch {
        return null;
    }
}

// Add a new project
async function addFeed({ rating, detail, username }) {
    try {
        const feed = new Feedback({
            rating,
            detail,
            username,
        });
        await feed.save();
        return feed;
    } catch {
        return null;
    }
}

// Delete an existing project
async function removeFeed(id) {
    try {
        await Feedback.findByIdAndDelete(id);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    fetchFeeds,
    addFeed,
    removeFeed,
};
