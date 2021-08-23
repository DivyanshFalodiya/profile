const router = require('express').Router();

router.get('/', async (req, res) => {
    res.render('feedback');
});
router.get('/add', async (req, res) => {
    res.render('feedadd');
});

module.exports = router;
