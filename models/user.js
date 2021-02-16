const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types; 
const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    enrolledCourses: [{
        type: ObjectId,
        ref: 'Item'
    }]
})

module.exports = mongoose.model('User', UserSchema);