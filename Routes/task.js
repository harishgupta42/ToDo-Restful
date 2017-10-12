'use strict';
let Controller = require('../Controllers/index').taskController;
let Joi = require('joi');
let constants = require('../config/constants');
let utils = require('../utils');
let Logger = require('../Libs/logger');

module.exports = [{
        /************ Add new task *************/
        method: 'POST',
        path: '/task',
        handler: (request, reply) => {
            Controller.postTask(request, reply).then(response => {
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
            description: 'Create a new task',
            tags: ['api', 'task'],
            validate: {
                payload: {
                    name: Joi.string().required().description('Enter task name'),
                    description: Joi.string().optional().description('Enter task description'),
                    dueOn: Joi.date().required().description('Enter due date in UTC')
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
        /************ Get Task *************/
        method: 'GET',
        path: '/task',
        handler: (request, reply) => {
            Controller.getTask(request, reply).then(response => {
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
            description: 'Get Task',
            tags: ['api', 'task'],
            validate: {
                query: {
                    taskId: Joi.string().optional().description('Enter task ID'),
                    name: Joi.string().optional().description('Enter task name'),
                    description: Joi.string().optional().description('Enter task description'),
                    dueOn: Joi.date().optional().description('Enter due date in UTC'),
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
        /************ Update Task *************/
        method: 'PUT',
        path: '/task',
        handler: (request, reply) => {
            Controller.putTask(request, reply).then(response => {
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
            description: 'Update task',
            tags: ['api', 'task'],
            validate: {
                payload: {
                    taskId: Joi.string().required().description('Enter task id'),
                    name: Joi.string().optional().description('Enter task name'),
                    description: Joi.string().optional().description('Enter task description'),
                    dueOn: Joi.date().optional().description('Enter due date in UTC'),
                    isCompleted: Joi.boolean().optional().description('TRUE : Completed, FALSE : Incomplete'),
                    isDeleted: Joi.boolean().optional().description('TRUE : Deleted, FALSE : Not Deleted')
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