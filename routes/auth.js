const { Router } = require('express');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const { saveUser, verifyUser, checkGuestAccess, getUserStatus } = require('../controllers/user');
const { validationResult } = require('express-validator');
const validationRegister = require('../controllers/validationRegister');
const validationLogin = require('../controllers/validationLogin');
const router = Router();

// GET requests
// Get login page
router.get('/user/login', checkGuestAccess, getUserStatus, (req, res) => {
    res.render('login', { isLoggedIn: req.isLoggedIn })
});
// Get register page
router.get('/user/register', checkGuestAccess, getUserStatus, (req, res) => {
    res.render('register', { isLoggedIn: req.isLoggedIn });
});
// Get logout page
router.get('/user/logout', getUserStatus, (req, res) => {
    res.clearCookie(config.cookie).redirect('/');
});

// POST requests
// Register an user
router.post('/user/register', validationRegister, async (req, res) => {
     
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            message: errors.array()[0].msg,
        })
    }
    try {
        await saveUser(req, res);
        res.redirect('/user/login');
    } catch (error) {
        console.log(error);
        res.redirect('/user/register');
    }
});

// User login
router.post('/user/login', validationLogin, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
            message: errors.array()[0].msg,
        })
    }
    const status = await verifyUser(req, res);
    if (status) {
        return res.redirect('/');
    }
    res.render('login', { message: 'Wrong username or password' })
});

module.exports = router;