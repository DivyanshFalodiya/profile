const Project = require('../models/ProjectModel');

// Fetch all projects
async function fetchProjects() {
    try {
        const data = await Project.find({});
        return data;
    } catch {
        return null;
    }
}

// Fetch project by id
async function fetchProject(id) {
    try {
        const data = await Project.findById(id);
        return data;
    } catch {
        return null;
    }
}

// Add a new project
async function addProject({ title, about, link, tech, image }) {
    try {
        const project = new Project({
            title,
            about,
            link,
            tech,
            image,
        });
        await project.save();
        return project;
    } catch {
        return null;
    }
}

// Update an existing project
async function updateProject(id, { title, about, link, tech, image }) {
    try {
        const project = await Project.findById(id);
        project.title = title;
        project.about = about;
        project.link = link;
        project.tech = tech;
        project.image = image;
        await project.save();
        return project;
    } catch {
        return null;
    }
}

module.exports = { fetchProjects, fetchProject, addProject, updateProject };
