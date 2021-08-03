require('dotenv').config();
const mongoose = require('mongoose');

const config = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.on('open', () => {
        console.log('Connected to db.');
    });

    return db;
};

module.exports = { config };
