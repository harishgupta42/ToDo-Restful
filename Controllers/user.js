'use strict';
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const utils = require('../utils');
const User = require('../Models/User')
const Logger = require('../Libs/logger');
const Constants = require('../config/constants');
const statusCodes = require('../config/statusCodes');
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUser = getUser;
exports.logoutUser = logoutUser;

/**
 * Register user
 * @param  {function} request
 * @param  {function} reply
 */
function registerUser(request, reply) {
    return new Promise((resolve, reject) => {
        let userInfo = request.payload;
        userInfo.access_token = uuidv1();
        if (userInfo.password) {
            userInfo.password = bcrypt.hashSync(userInfo.password, Constants.saltRounds)
        }
        User(userInfo).save()
            .then(success => {
                let response = {
                    flag: statusCodes.CREATED,
                    message: statusCodes.getStatusText(statusCodes.CREATED),
                    access_token: success.access_token
                }
                return resolve(response);
            })
            .catch(error => {
                return reject(error);
            });
    })
}
/**
 * Login user using email or username, and pasword
 * @param  {function} request
 * @param  {function} reply
 */
function loginUser(request, reply) {
    return new Promise((resolve, reject) => {
        let payload = request.payload;
        runner()
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            })

        async function runner() {
            let filters = {};
            if (payload.username) {
                filters.username = payload.username;
            }
            if (payload.email) {
                filters.email = payload.email;
            }

            let userArr = await User.find(filters);
            if (userArr.length === 0) {
                let response = {
                    flag: statusCodes.NOT_FOUND,
                    message: statusCodes.getStatusText(statusCodes.NOT_FOUND),
                    description: 'Username or email does not exist'
                }
                return response;
            }
            let user = userArr[0];
            if (user.password) {
                if(!payload.password) {
                    payload.password = "";
                }
                let checkPassword = bcrypt.compareSync(payload.password, user.password);
                if (!checkPassword) {
                    let response = {
                        flag: statusCodes.NOT_ACCEPTABLE,
                        message: statusCodes.getStatusText(statusCodes.NOT_ACCEPTABLE),
                        description: 'Password did not match'
                    }
                    return response;
                }
            }
            user.access_token = uuidv1();
            let updateInfo = {
                access_token: user.access_token
            }
            await User.findOneAndUpdate(filters, updateInfo)
            let response = {
                flag: statusCodes.OK,
                message: statusCodes.getStatusText(statusCodes.OK),
                user: user
            }
            return response;
        }
    })
}
/**
 * Get user details using Access Token
 * @param  {function} request
 * @param  {function} reply
 */
function getUser(request, reply) {
    return new Promise((resolve, reject) => {
        let filters = {
            access_token: request.headers.authorization
        }
        User.find(filters)
            .then(user => {
                if (user.length === 0) {
                    let response = {
                        flag: statusCodes.UNAUTHORIZED,
                        message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                        description: 'Invalid token'
                    }
                    return resolve(response);
                }
                let response = {
                    flag: statusCodes.OK,
                    message: statusCodes.getStatusText(statusCodes.OK),
                    user: user[0]
                }
                return resolve(response);
            })
            .catch(error => {
                return reject(error);
            });
    })
}
/**
 * Logout user using access token
 * Access token is destroyed on logout
 * @param  {function} request
 * @param  {function} reply
 */
function logoutUser(request, reply) {
    return new Promise((resolve, reject) => {
        let filters = {
            access_token: request.headers.authorization
        }
        let updateInfo = {
            access_token: null
        }
        User.findOneAndUpdate(filters, updateInfo)
            .then(user => {

                if (!user) {
                    let response = {
                        flag: statusCodes.UNAUTHORIZED,
                        message: statusCodes.getStatusText(statusCodes.UNAUTHORIZED),
                        description: 'Invalid token'
                    }
                    return resolve(response);
                }
                let response = {
                    flag: statusCodes.OK,
                    message: statusCodes.getStatusText(statusCodes.OK),
                    description: 'Logged out successfully'
                }
                return resolve(response);
            })
            .catch(error => {
                return reject(error);
            });
    })
}