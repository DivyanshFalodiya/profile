require('dotenv').config();
const jwt = require('jsonwebtoken');
const { transporter, createTemplate } = require('./mailController');

// Important variables
const maxAge = 24 * 60 * 60; // In seconds

const createToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

exports.verifyToken = (token) => {
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch {
        return;
    }

    if (!decoded.hasOwnProperty('email')) return;

    const { email } = decoded;
    return email;
};

exports.isAuthenticated = (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        res.render('login', {
            error: 'Sumimasen! Unable to verify.',
            success: '',
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch {
        res.render('login', {
            error: 'Sumimasen! Unable to verify.',
            success: '',
        });
        return;
    }

    if (!decoded.hasOwnProperty('email')) {
        res.render('login', {
            error: 'Sumimasen! Unable to verify.',
            success: '',
        });
        return;
    }

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    next();
};

exports.login = function (req, res) {
    const email = req.body.email;
    if (email === process.env.ADMIN_MAIL) {
        const token = createToken(email);
        const link = `http://localhost:3000/auth/callback?token=${token}`;
        const template = createTemplate(link);
        const mailOptions = {
            to: email,
            from: process.env.HOST_ID,
            subject: 'Admin Login',
            html: template,
        };
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.log(err);
                res.render('login', {
                    error: 'Something went wrong! Please try again later!',
                    success: '',
                });
                return;
            }
            res.render('login', {
                error: '',
                success: 'Please check you email to verify.',
            });
        });
    } else {
        res.render('login', { error: 'You are not the admin.', success: '' });
        return;
    }
};
