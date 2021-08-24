const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema(
    {
        rating: {
            required: true,
            type: Number,
            min: 0,
            max: 5,
            trim: true,
        },
        detail: {
            required: true,
            type: String,
            trim: true,
        },
        username: {
            required: true,
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
