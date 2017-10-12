'use strict';
let Controller = require('../Controllers/index').userController;
let Joi = require('joi');
let constants = require('../config/constants');
let utils = require('../utils');
let Logger = require('../Libs/logger');

module.exports = [{
        /************ Register User *************/
        method: 'POST',
        path: '/user',
        handler: (request, reply) => {
            Controller.registerUser(request, reply).then(response => {
                    Logger.winstonLogger.info({
                        RESPONSE: response
                    });
                    return utils.sendSuccessResponse(response, reply)
                })
                .catch(error => {
                    Logger.winstonLogger.error({
                        ERROR: error
                    });
                    return utils.sendErrorResponse(error, reply);
                })
        },
        config: {
            description: 'Register User',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    first_name: Joi.string().required().description('Enter first name'),
                    last_name: Joi.string().required().description('Enter last name'),
                    username: Joi.string().required().description('Enter username'),
                    email: Joi.string().email().required().description('Enter email'),
                    password: Joi.string().optional().min(6).trim().description('Enter password')
                },
                failAction: utils.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    response: constants.swaggerDefaultResponseMessages()
                }
            }
        }
    },
    {
        /************ Login User *************/
        method: 'POST',
        path: '/user/login',
        handler: (request, reply) => {
            Controller.loginUser(request, reply).then(response => {
                    Logger.winstonLogger.info({
                        RESPONSE: response
                    });
                    return utils.sendSuccessResponse(response, reply)
                })
                .catch(error => {
                    Logger.winstonLogger.error({
                        ERROR: error
                    });
                    return utils.sendErrorResponse(error, reply);
                })
        },
        config: {
            description: 'User Login',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    username: Joi.string().optional().description('Enter username'),
                    email: Joi.string().email().optional().description('Enter email'),
                    password: Joi.string().optional().min(6).trim().description('Enter password')
                },
                failAction: utils.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    response: constants.swaggerDefaultResponseMessages()
                }
            }
        }
    },
    {
        /************ Get User *************/
        method: 'GET',
        path: '/user',
        handler: (request, reply) => {
            Controller.getUser(request, reply).then(response => {
                    Logger.winstonLogger.info({
                        RESPONSE: response
                    });
                    return utils.sendSuccessResponse(response, reply)
                })
                .catch(error => {
                    Logger.winstonLogger.error({
                        ERROR: error
                    });
                    return utils.sendErrorResponse(error, reply);
                })
        },
        config: {
            description: 'Get User',
            tags: ['api', 'user'],
            validate: {
                headers: Joi.object({
                    authorization: Joi.string().required().description('Access Token')
                }).unknown(),
                failAction: utils.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    response: constants.swaggerDefaultResponseMessages()
                }
            }
        }
    },
    {
        /************ Logout User *************/
        method: 'POST',
        path: '/user/logout',
        handler: (request, reply) => {
            Controller.logoutUser(request, reply).then(response => {
                    Logger.winstonLogger.info({
                        RESPONSE: response
                    });
                    return utils.sendSuccessResponse(response, reply)
                })
                .catch(error => {
                    Logger.winstonLogger.error({
                        ERROR: error
                    });
                    return utils.sendErrorResponse(error, reply);
                })
        },
        config: {
            description: 'User Logout',
            tags: ['api', 'user'],
            validate: {
                headers: Joi.object({
                    authorization: Joi.string().required().description('Access Token')
                }).unknown(),
                failAction: utils.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    response: constants.swaggerDefaultResponseMessages()
                }
            }
        }
    }
]