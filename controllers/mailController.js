require('dotenv').config();
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.HOST_ID,
        pass: process.env.HOST_PASS,
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
