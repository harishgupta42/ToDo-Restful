const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: false
    },
    access_token: {
        type: String,
        required: true,
        index : true    //creates access_token as index
    }
}, {
    timestamps: true    //inserts createdAt and updatedAt
});
module.exports = mongoose.model('user', user);