const router = require('express').Router();
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
    res.render('login', { error: '', success: '' });
});

router.get('/callback', authController.verifyToken, (req, res) => {
    res.redirect('/');
});

router.post('/', authController.login);

module.exports = router;
