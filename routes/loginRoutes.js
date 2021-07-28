const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.get('/', (req, res) => {
    res.render('login', { error: '' });
});

router.post('/', loginController.login);

module.exports = router;
