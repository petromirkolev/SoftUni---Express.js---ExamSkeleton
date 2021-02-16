const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate a JWT token for the user cookie
const generateToken = data => {
    const token = jwt.sign(data, config.privateKey);
    return token;
}

// Save the user in the database
const saveUser = async (req, res) => {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(config.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({
        username,
        password: hash,
        likedPlays: []
    })

    try {
        const userObject = await user.save();
        const token = generateToken({
            userID: userObject._id,
            username: userObject.username
        })
        res.cookie(config.cookie, token);
        return true;
    } catch (error) {
        console.log(error);
        return res.redirect('/register');
    }
}
// Verify if there is such a registered user in the database
const verifyUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) { return false }

    const status = await bcrypt.compare(password, user.password);
    if (status) {
        const token = generateToken({
            userID: user._id,
            username: user.username
        });
        res.cookie(config.cookie, token);
    }
    return status;
}

// Check if the user is logged in or not so we can use it in Handlebars
const getUserStatus = (req, res, next) => {
    const token = req.cookies[config.cookie];
    if (!token) {
        req.isLoggedIn = false;
    }

    try {
        jwt.verify(token, config.privateKey);
        req.isLoggedIn = true;
    } catch (e) {
        req.isLoggedIn = false;
    }
    next();
}

// Check if something can be accessed by guests
const checkGuestAccess = (req, res, next) => {
    const token = req.cookies[config.cookie];
    if (token) {
        return res.redirect('/');
    }
    next();
}

// Check if the user is authenticated to perform an action
const checkAuthentication = async (req, res, next) => {
    const token = req.cookies[config.cookie];
    if (!token) {
        return res.redirect('/');
    }

    try {
        decodedObject = jwt.verify(token, config.privateKey);
        const user = await User.findById(decodedObject.userID);
        req.user = user;
        res.locals.user = req.user;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
}

module.exports = {
    saveUser,
    verifyUser,
    getUserStatus,
    checkGuestAccess,
    checkAuthentication,
}