require('dotenv').config();
const mongoose = require('mongoose');

const config = () => {
    mongoose.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.z7oow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.on('open', () => {
        console.log('Connected to db.');
    });

    return db;
};

module.exports = { config };
