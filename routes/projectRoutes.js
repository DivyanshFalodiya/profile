const router = require('express').Router();
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectsController');

router.get('/', async (req, res) => {
    const projects = projectController.fetchProjects();
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
});

module.exports = router;
