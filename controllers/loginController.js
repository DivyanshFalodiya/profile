const adminModel = require('../models/AdminModel');

exports.login = function (req, res) {
    admin = new adminModel({
        email: req.body.email,
        password: req.body.password,
    });
    res.redirect('/');
};
