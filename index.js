// Require modules
require('dotenv').config();
require('./config/dbconfig').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const homeRoutes = require('./routes/homeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

// App and middlewares
const app = express();

// EJS and frontend
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Protocol
app.enable('trust proxy');

// Routes
app.use('/', homeRoutes);
app.use('/work', projectRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Listening on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
