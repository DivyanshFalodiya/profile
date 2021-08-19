const router = require('express').Router();
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectsController');

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

router.get('/:id', async (req, res) => {
    const project = await projectController.fetchProject(req.params.id);
    if (project != null) {
        const cookies = req.cookies;
        if (!cookies.jwt) {
            res.render('project', { project: project, admin: false });
            return;
        }
        const email = authController.verifyToken(cookies.jwt);
        if (email === process.env.ADMIN_MAIL) {
            res.render('project', { project: project, admin: true });
            return;
        }
        res.render('project', { project: project, admin: false });
    }
    res.status(501);
});

// Admin only route for updating project
router.get('/:id/edit', authController.isAuthenticated, async (req, res) => {
    const project = await projectController.fetchProject(req.params.id);
    if (project) {
        res.render('edit', { project, error: '', success: '' });
        return;
    }
    res.status(401).send('Bad Request');
});

// Admin only route for updating project
router.get('/add', authController.isAuthenticated, (req, res) => {
    res.render('add');
});

module.exports = router;
