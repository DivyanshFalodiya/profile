const router = require('express').Router();
const projectController = require('../controllers/projectsController');

router.get('/', async (req, res) => {
    const projects = projectController.fetchProjects();
    res.render('projects', { projects });
});

module.exports = router;
