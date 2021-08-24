const router = require('express').Router();
const feedController = require('../controllers/feedbackController');

router.get('/', async (req, res) => {
    const feedbacks = await feedController.fetchFeeds();
    res.render('feedback', { feedbacks: feedbacks });
});
router.get('/add', async (req, res) => {
    res.render('feedadd', { error: '', success: '' });
});

module.exports = router;
