const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    roles: {
        required: true,
        type: [String],
        trim: true,
    },
    about: {
        required: true,
        type: String,
        trim: true,
    },
    skills: {
        required: true,
        type: [String],
        trim: true,
    },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = { Profile, ProfileSchema };
