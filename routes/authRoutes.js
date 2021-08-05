const router = require('express').Router();
const authController = require('../controllers/authController');

// Get Login route
router.get('/', (req, res) => {
    res.render('login', { error: '', success: '' });
});

// Get Logout route
router.get('/logout', (req, res) => {
    res.cookie('jwt', '');
    res.redirect('/');
});

// Callback for login auth
router.get('/callback', authController.isAuthenticated, (req, res) => {
    res.redirect('/');
});

// Post request to login
router.post('/', authController.login);

module.exports = router;
