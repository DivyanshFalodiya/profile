const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('projects');
});

module.exports = router;
