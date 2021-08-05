const router = require('express').Router();
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectsController');
const Project = require('../models/ProjectModel');

// General route to visit projects
router.get('/', async (req, res) => {
    const projects = await projectController.fetchProjects();
    if (projects != null) {
        const cookies = req.cookies;
        if (!cookies.jwt) {
            res.render('projects', { projects: projects, admin: false });
            return;
        }
        const email = authController.verifyToken(cookies.jwt);
        if (email === process.env.ADMIN_MAIL) {
            res.render('projects', { projects: projects, admin: true });
            return;
        }
        res.render('projects', { projects: projects, admin: false });
    }
    res.status(501);
});

// Admin only route for updating project
router.get('/edit/:id', authController.isAuthenticated, async (req, res) => {
    const project = await projectController.fetchProject(req.params.id);
    if (project) {
        res.render('edit', { project, error: '', success: '' });
        return;
    }
    res.status(401).send('Bad Request');
});

// Admin only route for updating project
router.get('/add', authController.isAuthenticated, async (req, res) => {
    const project = new Project();
    res.render('edit', { project, error: '', success: '' });
    res.json({ update: false });
});

// Admin only route for adding new project
router.get('/edit', authController.isAuthenticated, async (req, res) => {
    const project = {
        title: '',
        about: '',
        image: '',
        link: '',
        tech: [],
    };
    res.render('edit', { project, error: '', success: '' });
});

module.exports = router;
