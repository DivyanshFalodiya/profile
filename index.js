// Require modules
const express = require('express');
const homeRoutes = require('./routes/homeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const loginRoutes = require('./routes/loginRoutes');

// App and middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/', homeRoutes);
app.use('/projects', projectRoutes);
app.use('/about', aboutRoutes);
app.use('/admin-login', loginRoutes);

// Listening on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
