'use strict';
let Controller = require('../Controllers/index').noteController;
let Joi = require('joi');
let constants = require('../config/constants');
let utils = require('../utils');
let Logger = require('../Libs/logger');

module.exports = [{
        /************ Add new note *************/
        method: 'POST',
        path: '/note',
        handler: (request, reply) => {
            Controller.postNote(request, reply).then(response => {
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
            description: 'Create a new note',
            tags: ['api', 'note'],
            validate: {
                payload: {
                    taskId: Joi.string().optional().description('Enter task ID'),
                    note: Joi.string().required().description('Enter note')
                },
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
        /************ Get Notes *************/
        method: 'GET',
        path: '/note',
        handler: (request, reply) => {
            Controller.getNote(request, reply).then(response => {
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
            description: 'Get notes',
            tags: ['api', 'note'],
            validate: {
                query: {
                    taskId: Joi.string().required().description('Enter task ID'),
                    noteId: Joi.string().optional().description('Enter note ID'),
                    isCompleted: Joi.boolean().optional().description('TRUE : Completed, FALSE : Incomplete'),
                    isDeleted: Joi.boolean().optional().description('TRUE : Deleted, FALSE : Not Deleted'),
                    limit: Joi.number(),
                    skip: Joi.number()
                },
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
    }, {
        /************ Update Note *************/
        method: 'PUT',
        path: '/note',
        handler: (request, reply) => {
            Controller.putNote(request, reply).then(response => {
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
            description: 'Update note',
            tags: ['api', 'note'],
            validate: {
                payload: {
                    taskId: Joi.string().optional().description('Enter task ID'),
                    noteId: Joi.string().optional().description('Enter note ID'),
                    isCompleted: Joi.boolean().optional().description('TRUE : Completed, FALSE : Incomplete'),
                    isDeleted: Joi.boolean().optional().description('TRUE : Deleted, FALSE : Not Deleted'),
                },
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