const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

    userID: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    expiry: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        require: true
    }
});

const PROJECTS = mongoose.model('projects', projectSchema);

module.exports = PROJECTS;
