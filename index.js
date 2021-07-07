// Require modules
const express = require('express');
const homeRoutes = require('./routes/homeRoutes');

// App and middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use('/', homeRoutes);

// Listening on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
