require('dotenv').config();
const jwt = require('jsonwebtoken');
const { transporter, createTemplate } = require('./mailController');

// Important variables
const maxAge = 24 * 60 * 60; // In seconds

// Create a token using email
const createToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

// Verify if the token is correct
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

// Middleware to check the request for authentication
exports.isAuthenticated = (req, res, next) => {
    const token = req.query.token || req.cookies.jwt;
    if (!token) {
        res.status(403).json({
            error: 'Sumimasen! Unable to verify.',
        });
        return;
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch {
        res.status(403).json({
            error: 'Sumimasen! Unable to verify.',
        });
        return;
    }

    if (!decoded.hasOwnProperty('email')) {
        res.status(403).json({
            error: 'Sumimasen! Unable to verify.',
        });
        return;
    }

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    next();
};

// Login request handler
exports.login = function (req, res) {
    const email = req.body.email;
    const secret = req.body.secret;
    if (
        email === process.env.ADMIN_MAIL &&
        secret === process.env.ADMIN_SECRET
    ) {
        const token = createToken(email);
        const link = `${req.protocol}://${req.get(
            'host'
        )}/auth/callback?token=${token}`;
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
                res.status(501).json({
                    error: 'Something went wrong. Please try again later',
                });
                return;
            }
            res.status(200).json({
                success: 'Please check your email to verify.',
            });
            return;
        });
    } else {
        res.status(403).json({ error: 'You are not the admin' });
        return;
    }
};
