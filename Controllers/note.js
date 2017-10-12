'use strict';
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const utils = require('../utils');

const Task = require('../Models/Task');
const User = require('../Models/User');
const Note = require('../Models/Note');
const Logger = require('../Libs/logger');
const Constants = require('../config/constants');
const statusCodes = require('../config/statusCodes');
exports.postNote = postNote;
exports.getNote = getNote;
exports.putNote = putNote;

/**
 * Create a new note
 * @param  {function} request
 * @param  {function} reply
 */
function postNote(request, reply) {
    return new Promise((resolve, reject) => {
        let access_token = request.headers.authorization;
        let noteInfo = request.payload;

        runner()
            .then(response => {
                return resolve(response);
            })
            .catch(error => {
                return reject(error);
            })
        async function runner() {
            // Check access token
            let userFilters = {
                access_token: access_token
            }
            let userArr = await User.find(userFilters);
            if (userArr.length === 0) {
                let response = {
                    flag: statusCodes.UNAUTHORIZED,
                    message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                    description: 'Invalid token'
                }
                return response;
            }

            // Get task
            let taskFilters = {
                _id: noteInfo.taskId
            }
            let taskArr = await Task.find(taskFilters);
            if (taskArr.length === 0) {
                let response = {
                    flag: statusCodes.UNAUTHORIZED,
                    message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                    description: 'Task not found'
                }
                return response;
            }
            // Check if task is deleted
            if (taskArr[0].isDeleted === true) {
                let response = {
                    flag: statusCodes.NOT_ACCEPTABLE,
                    message: statusCodes.getStatusText(statusCodes.NOT_ACCEPTABLE),
                    description: 'Task is deleted'
                }
                return response;
            }
            // Check if task is completed
            if (taskArr[0].isCompleted === true) {
                let response = {
                    flag: statusCodes.NOT_ACCEPTABLE,
                    message: statusCodes.getStatusText(statusCodes.NOT_ACCEPTABLE),
                    description: 'Task is completed'
                }
                return response;
            }

            let noteId = await Note(noteInfo).save();
            let response = {
                flag: statusCodes.CREATED,
                message: statusCodes.getStatusText(statusCodes.CREATED),
                noteId: noteId
            }
            return response;
        }
    })
}
/**
 * Get note(s) corresponding to task
 * @param  {function} request
 * @param  {function} reply
 */
function getNote(request, reply) {
    return new Promise((resolve, reject) => {
        if (!request.query.taskId && !request.query.noteId) {
            let response = {
                flag: statusCodes.NO_CONTENT,
                message: statusCodes.getStatusText(statusCodes.NO_CONTENT)
            }
            return response;
        }
        let access_token = request.headers.authorization;
        let limit = request.query.limit || 10;
        let skip = request.query.skip || 0;
        delete request.query.limit;
        delete request.query.skip;
        let noteFilter = request.query || {};
        if (noteFilter.noteId) {
            noteFilter._id = noteFilter.noteId;
            delete noteFilter.noteId;
        }
        runner()
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            })

        async function runner() {
            let userFilters = {
                access_token: access_token
            }
            let userArr = await User.find(userFilters);
            if (userArr.length === 0) {
                let response = {
                    flag: statusCodes.UNAUTHORIZED,
                    message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                    description: 'Invalid token'
                }
                return response;
            }
            // Get task
            let taskFilters = {
                _id: noteFilter.taskId
            }
            let taskArr = await Task.find(taskFilters);
            if (taskArr.length === 0) {
                let response = {
                    flag: statusCodes.UNAUTHORIZED,
                    message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                    description: 'Task not found'
                }
                return response;
            }

            let noteArr = await Note.find(noteFilter).limit(limit).skip(skip);

            let response = {
                flag: statusCodes.OK,
                message: statusCodes.getStatusText(statusCodes.OK),
                noteArr: noteArr
            }
            return response;
        }
    })
}
/**
 * Update note
 * @param  {function} request
 * @param  {function} reply
 */
function putNote(request, reply) {
    return new Promise((resolve, reject) => {
        let access_token = request.headers.authorization;
        let noteFilter = {
            _id: request.payload.noteId
        };
        delete request.payload.noteId
        runner()
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            })

        async function runner() {
            // Check task details 
            if (noteFilter.taskId) {
                let taskFilters = {
                    _id: noteFilter.taskId
                }
                let taskArr = await Task.find(taskFilters);
                if (taskArr.length === 0) {
                    let response = {
                        flag: statusCodes.UNAUTHORIZED,
                        message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                        description: 'Task not found'
                    }
                    return response;
                }
                // Check if task is deleted
                if (taskArr[0].isDeleted === true) {
                    let response = {
                        flag: statusCodes.NOT_ACCEPTABLE,
                        message: statusCodes.getStatusText(statusCodes.NOT_ACCEPTABLE),
                        description: 'Task is deleted'
                    }
                    return response;
                }
                // Check if task is completed
                if (taskArr[0].isCompleted === true) {
                    let response = {
                        flag: statusCodes.NOT_ACCEPTABLE,
                        message: statusCodes.getStatusText(statusCodes.NOT_ACCEPTABLE),
                        description: 'Task is completed'
                    }
                    return response;
                }
            }
            // Check access token
            let userFilters = {
                access_token: access_token
            }
            let userArr = await User.find(userFilters);
            if (userArr.length === 0) {
                let response = {
                    flag: statusCodes.UNAUTHORIZED,
                    message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                    description: 'Invalid token'
                }
                return response;
            }

            let updateInfo = request.payload;
            await Note.findOneAndUpdate(noteFilter, updateInfo);
            let response = {
                flag: statusCodes.ACCEPTED,
                message: statusCodes.getStatusText(statusCodes.ACCEPTED),
                description: 'Note updated successfully'
            }
            return response;
        }
    })
}