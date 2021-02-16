const { body } = require('express-validator');

module.exports = [
    // Validate title
    body('title', 'The title should not be empty')
        .isLength({
            min: 1
        }),
    // Validate description
    body('description', 'The description should not be empty')
        .isLength({
            min: 1
        }),
    // Validate image URL
    body('imageUrl', 'The image URL should not be empty')
        .isLength({
            min: 1
        }),
    // Validate duration or else
    body('duration', 'The duration should not be empty')
        .isLength({
            min: 1
        })
]