const { Router } = require('express');
const { validationResult } = require('express-validator');
const { getUserStatus, checkAuthentication } = require('../controllers/user');
const itemValidation = require('../controllers/itemValidation');
const Item = require('../models/item');
const { sortByEnrolls, sortByDate } = require('../controllers/item');
const router = Router();

//GET requests
// Get home page
router.get('/', getUserStatus, async (req, res) => {
    const items = await Item.find({}).lean();
    const enrolled = await sortByEnrolls();
    const username = res.locals.username;
    console.log(username);

    res.render('home', {
        isLoggedIn: req.isLoggedIn,
        enrolled,
        items,
        username
    });
});

// Get item create page
router.get('/course/create', checkAuthentication, getUserStatus, async (req, res) => {
    res.render('create', {
        isLoggedIn: req.isLoggedIn,
    });
});

// Get item details page
router.get('/course/details/:id', checkAuthentication, getUserStatus, (req, res) => {
    Item
        .findById(req.params.id)
        .lean()
        .then((item) => {
            const isCreator = item.creator.toString() === req.user._id.toString();
            const isEnrolled = item.usersEnrolled.filter(x => x.toString() === req.user._id.toString());
            res.render('details', {
                isLoggedIn: req.isLoggedIn,
                isEnrolled,
                isCreator,
                ...item
            });
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/');
        });
});

// Get item subscribe/enroll page
router.get('/course/enroll/:id', checkAuthentication, (req, res) => {

    const itemId = req.params.id;
    const { _id } = req.user;

    Item
        .findByIdAndUpdate(itemId, {
            $addToSet: {
                usersEnrolled: [_id],
            }
        })
        .then((item) => {
            res.redirect(`/course/details/${itemId}`);
        })
        .catch((error) => {
            console.log(error)
        });
});

// Delete an item
router.get('/course/delete/:id', checkAuthentication, (req, res) => {
    Item
        .deleteOne({ _id: req.params.id })
        .then((item) => {
            res.redirect('/');
        })
        .catch((error) => {
            console.log(error)
        });
});

// Edit an item
router.get('/course/edit/:id', checkAuthentication, (req, res) => {
    Item
        .findOne({ _id: req.params.id })
        .then((item) => {
            res.render('edit', item);
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/course/details/:id');
        });
});

// Create an item
router.post('/course/create', checkAuthentication, itemValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('create', {
            message: errors.array()[0].msg,
        });
    };
    const { title, description, imageUrl, duration } = req.body;
    const { _id } = req.user;
    const createdAt = new Date().toLocaleDateString();
    const item = new Item({
        title,
        description,
        imageUrl,
        duration,
        createdAt,
        creator: _id,
    });
    item
        .save()
        .then((item) => {
            res.redirect('/');
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/');
        });
});

// Edit an item
router.post('/course/edit/:id', checkAuthentication, (req, res) => {
    const { title, description, imageUrl, duration } = req.body;
    Item.updateOne({
        _id: req.params.id
    },
        {
            $set: {
                title,
                description,
                imageUrl,
                duration,
            }
        })
        .then((updatedItem) => {
            console.log(updatedItem);
            res.redirect('/');
        });
});

module.exports = router;