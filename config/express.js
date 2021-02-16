const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const auth = require('../controllers/auth');

module.exports = (app) => {
    app.use(cookieParser());
    app.use(auth);
    app.use(express.urlencoded({ extended: true }));
    app.engine('.hbs', handlebars({ extname: '.hbs' }));
    app.set('view engine', '.hbs');
    app.use(express.static('static'));
};