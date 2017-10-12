const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const task = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: null
    },
    dueOn: {
        type: Date,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: false,
        default: false
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true //inserts createdAt and updatedAt
});
module.exports = mongoose.model('task', task);