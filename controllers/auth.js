const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Check whether the user has a cookie and if yes - attach his details to the localSession
module.exports = async (req, res, next) => {
    const token = req.cookies[config.cookie];
    // If there is no cookie - stop the check and continue
    if (!token) {
        next();
        return;
    }
    try {
        // Verify whether the user token is valid
        foundUser = jwt.verify(token, config.privateKey);
        const user = await User.findById(foundUser.userID);
        // Attach the user to the request
        req.user = user;
        // Attach the user username to the localSession
        res.locals.username = req.user.username;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
}
