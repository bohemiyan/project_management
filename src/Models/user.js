const mongoose = require("mongoose");


const userschema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'emp',
        required: true,
        trim: true
      },
    password: {
        type: String,
        required: true,
        trim: true
    },
    lastaccesstime: {
        type: String,
        trum: true
    },
    verified: {
        type: Boolean,
        default: false
    }

})
// Static methods for the 'users' model


const USERS = mongoose.model('user', userschema)

module.exports = { USERS };
