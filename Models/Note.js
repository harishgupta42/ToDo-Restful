const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const note = new Schema({
    taskId: {
        type: Schema.ObjectId,
        ref: 'task',
        required: true
    },
    note: {
        type: String,
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
module.exports = mongoose.model('note', note);