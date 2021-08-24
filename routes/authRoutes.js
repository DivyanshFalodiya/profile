const router = require('express').Router();
const authController = require('../controllers/authController');

// Get Login route
router.get('/', authController.checkAdmin, (req, res) => {
    res.render('login', { error: '', success: '', admin: res.isAdmin });
});

// Get Logout route
router.get('/logout', (req, res) => {
    res.cookie('jwt', '');
    res.redirect('/');
});

// Callback for login auth
router.get('/callback', authController.authenticate, (req, res) => {
    res.redirect('/');
});

// Post request to login
router.post('/', authController.login);

module.exports = router;
