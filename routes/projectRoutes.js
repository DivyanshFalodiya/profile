const router = require('express').Router();
const projectController = require('../controllers/projectsController');

router.get('/', async (req, res) => {
    const projects = projectController.fetchProjects();
    const cookies = req.cookies;
    res.render('projects', { projects: projects });
});

module.exports = router;
