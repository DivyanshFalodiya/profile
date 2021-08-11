require('dotenv').config();
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        XOAuth2: {
            user: process.env.HOST_ID,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    },
});

const createTemplate = (link) => {
    return `
    <h3> Welcome to my portfolio. </h3>
    <p> Please follow the link below to authenticate yourself. </p>
    <p> ${link} </p>
    `;
};

module.exports = { transporter, createTemplate };
