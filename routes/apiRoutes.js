const router = require('express').Router();
const authController = require('../controllers/authController');
const projectsController = require('../controllers/projectsController');

// Get all projects
router.get('/projects', async (req, res) => {
    const projects = await projectsController.fetchProjects();
    res.send(projects);
});

// Get project by id
router.get('/projects/:id', async (req, res) => {
    const projects = await projectsController.fetchProject(req.params.id);
    res.status(200).json(projects);
});

// Admin only route to update a project
router.patch(
    '/projects/:id',
    authController.isAuthenticated,
    async (req, res) => {
        const project = await projectsController.updateProject(
            req.params.id,
            req.body
        );
        if (project != null) {
            res.status(200).json({
                success: 'Updated successfully.',
            });
            return;
        }
        res.status(400).json({
            error: 'Something went wrong! Could not update!',
        });
    }
);
// Admin only route to add a new project
router.post('/projects', authController.isAuthenticated, async (req, res) => {
    const project = await projectsController.addProject(req.body);
    if (project != null) {
        res.status(200).send(project._id);
        return;
    }
    res.status(501);
});

module.exports = router;
