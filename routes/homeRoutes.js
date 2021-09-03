const router = require('express').Router();
const skills = require('../stuff/skills');

router.get('/', (req, res) => {
    res.render('index', { skills: skills });
});

module.exports = router;
