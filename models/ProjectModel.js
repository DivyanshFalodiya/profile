const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    title: {
        required: true,
        type: String,
        trim: true,
    },
    about: {
        required: true,
        type: String,
        trim: true,
    },
    link: {
        required: true,
        type: String,
        trim: true,
    },
    tech: {
        type: [String],
        trim: true,
    },
    image: {
        required: true,
        type: String,
        trim: true,
    },
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
