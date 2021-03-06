const router = require('express').Router();
const authController = require('../controllers/authController');
const projectsController = require('../controllers/projectsController');
const feedsController = require('../controllers/feedbackController');

// Get all projects
router.get('/projects', async (req, res) => {
    const projects = await projectsController.fetchProjects();
    res.send(projects);
});

// Get project by id
router.get('/projects/:id', async (req, res) => {
    const project = await projectsController.fetchProject(req.params.id);
    res.send(project);
});

// Post feedback
router.get('/feedback', async (req, res) => {
    const feeds = await feedsController.fetchFeeds();
    res.send(feeds);
});

// Post feedback
router.post('/feedback', async (req, res) => {
    const feed = await feedsController.addFeed(req.body);
    if (feed != null) {
        res.status(200).json({
            success: 'Added successfully',
        });
        return;
    }
    res.status(501).json({
        error: 'Something went wrong! Could not add!',
    });
});

// Admin route to delete feedback
router.delete(
    '/feedback/:id',
    authController.isAuthenticated,
    async (req, res) => {
        const result = await feedsController.removeFeed(req.params.id);
        if (result) {
            res.redirect('/');
            return;
        }
        res.status(501).json({
            success: false,
        });
    }
);

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
        res.status(200).json({
            id: project._id,
            success: 'Added successfully',
        });
        return;
    }
    res.status(501).json({
        error: 'Something went wrong! Could not add!',
    });
});

// Admin only route to delete an project
router.delete(
    '/projects/:id',
    authController.isAuthenticated,
    async (req, res) => {
        const result = await projectsController.removeProject(req.params.id);
        if (result) {
            res.redirect('/work');
            return;
        }
        res.status(501).json({
            success: false,
        });
    }
);

module.exports = router;
