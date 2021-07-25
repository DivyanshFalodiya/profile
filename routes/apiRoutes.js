const router = require('express').Router();
const projectsController = require('../controllers/projectsController');

router.get('/projects', async (req, res) => {
    const projects = projectsController.fetchProjects();
    res.send(projects);
});

module.exports = router;
