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
exports.postTask = postTask;
exports.getTask = getTask;
exports.putTask = putTask;

/**
 * Create a new task
 * @param  {function} request
 * @param  {function} reply
 */
function postTask(request, reply) {
    return new Promise((resolve, reject) => {
        let access_token = request.headers.authorization;
        let taskInfo = request.payload;

        runner()
            .then(response => {
                return resolve(response);
            })
            .catch(error => {
                return reject(error);
            })
        async function runner() {
            // Check task completion date/time
            let currentDate = new Date();
            if (taskInfo.dueOn < currentDate) {
                let response = {
                    flag: statusCodes.NOT_ACCEPTABLE,
                    message: statusCodes.getStatusText(statusCodes.NOT_ACCEPTABLE),
                    description: 'Err! Due date/time is already gone'
                }
                return response;
            }
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
            let user = userArr[0];
            taskInfo.userId = user._id;
            let taskId = await Task(taskInfo).save();
            let response = {
                flag: statusCodes.CREATED,
                message: statusCodes.getStatusText(statusCodes.CREATED),
                taskId: taskId
            }
            return response;
        }
    })
}
/**
 * Get task of a user
 * @param  {function} request
 * @param  {function} reply
 */
function getTask(request, reply) {
    return new Promise((resolve, reject) => {
        let access_token = request.headers.authorization;
        let limit = request.query.limit || 10;
        let skip = request.query.skip || 0;
        delete request.query.limit;
        delete request.query.skip;
        let taskFilters = request.query || {};
        if (taskFilters.taskId) {
            taskFilters._id = taskFilters.taskId;
            delete taskFilters.taskId;
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
            let user = userArr[0];
            taskFilters.userId = user._id;
            let taskArr = await Task.find(taskFilters).limit(limit).skip(skip);
            // Get notes of the task
            let noteArr;
            if (taskArr.length > 0) {
                let taskIdArr = [];
                taskArr.forEach(task => {
                    taskIdArr.push(task._id);
                });
                let noteFilter = {
                    taskId: {
                        "$in": taskIdArr
                    },
                    isDeleted: false,
                    isCompleted: false
                }
                noteArr = await Note.find(noteFilter);
            }
            let response = {
                flag: statusCodes.OK,
                message: statusCodes.getStatusText(statusCodes.OK),
                taskArr: taskArr,
                noteArr: noteArr
            }
            return response;
        }
    })
}
/**
 * Update Task Details
 * @param  {function} request
 * @param  {function} reply
 */
function putTask(request, reply) {
    return new Promise((resolve, reject) => {
        let access_token = request.headers.authorization;
        let taskFilters = {
            _id: request.payload.taskId
        };
        delete request.payload.taskId
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
            let user = userArr[0];
            taskFilters.userId = user._id;
            let updateInfo = request.payload;
            await Task.findOneAndUpdate(taskFilters, updateInfo);
            let response = {
                flag: statusCodes.ACCEPTED,
                message: statusCodes.getStatusText(statusCodes.ACCEPTED),
                description: 'Task updated successfully'
            }
            return response;
        }
    })
}