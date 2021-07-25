// Require modules
const express = require('express');
const session = require('express-session');
const homeRoutes = require('./routes/homeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const loginRoutes = require('./routes/loginRoutes');
const apiRoutes = require('./routes/apiRoutes');

// App and middlewares
const app = express();

// Session
app.set('trust proxy', 1);
app.use(
    session({
        secret: process.env.SESSION_KEY || 'somerandomkey',
        resave: false,
        saveUninitialized: true,
        cookie: {
            sameSite: 'strict',
            secure: true,
        },
    })
);

// EJS and frontend
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', homeRoutes);
app.use('/work', projectRoutes);
app.use('/login', loginRoutes);
app.use('/api', apiRoutes);

// Listening on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
