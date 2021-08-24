const router = require('express').Router();
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectsController');

// General route to visit projects
router.get('/', authController.checkAdmin, async (req, res) => {
    const projects = await projectController.fetchProjects();
    if (projects != null) {
        res.render('projects', { projects: projects, admin: res.isAdmin });
    }
    res.status(501);
});

// Admin only route for updating project
router.get('/add', authController.isAuthenticated, (req, res) => {
    res.render('add');
});

router.get('/:id', authController.checkAdmin, async (req, res) => {
    const project = await projectController.fetchProject(req.params.id);
    if (project != null) {
        res.render('project', { project: project, admin: res.isAdmin });
    }
    res.status(501);
});

// Admin only route for updating project
router.get('/edit/:id/', authController.isAuthenticated, async (req, res) => {
    const project = await projectController.fetchProject(req.params.id);
    if (project) {
        res.render('edit', { project, error: '', success: '' });
        return;
    }
    res.status(401).send('Bad Request');
});

module.exports = router;
