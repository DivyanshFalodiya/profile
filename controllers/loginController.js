exports.login = function (req, res) {
    const email = req.body.email;
    if (email === process.env.ADMIN_MAIL) {
    } else {
        res.render('login', { error: 'You are not the admin.' });
    }
};
