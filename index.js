const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const app = require('express')();
const indexRouter = require('./routes');
const autRouter = require('./routes/auth');
const mongoose = require('mongoose');

// Connect to database
mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (err) {
        console.error(err);
        throw err;
        };
}, console.log('*'.repeat(5) + ' Database connected ' + '*'.repeat(5)));

require('./config/express')(app);

// Use routers
app.use('/', indexRouter);
app.use('/', autRouter);

// Start server
app.listen(config.port, console.log(`Server listening on port ${config.port}!`));