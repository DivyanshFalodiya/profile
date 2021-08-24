const router = require('express').Router();
const authController = require('../controllers/authController');
const feedController = require('../controllers/feedbackController');

router.get('/', authController.checkAdmin, async (req, res) => {
    const feedbacks = await feedController.fetchFeeds();
    res.render('feedback', { feedbacks: feedbacks, admin: res.isAdmin });
});
router.get('/add', async (req, res) => {
    res.render('feedadd', { error: '', success: '' });
});

module.exports = router;
