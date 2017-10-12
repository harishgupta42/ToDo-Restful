'use strict';

const Joi = require('joi');

module.exports = {
    swaggerDefaultResponseMessages: function () { //Default Messages for Swagger
        let successResponse;

        successResponse = Joi.object({
            key: 'value'
        })
        return {
            '200': {
                'description': 'Success',
                'schema': Joi.object({
                    statusCode: Joi.number().default('20X'),
                    message: Joi.string(),
                    data: successResponse
                }).label('Response')
            },
            '400': {
                'description': 'Bad Request',
                'schema': Joi.object({
                    statusCode: Joi.number().default('400'),
                    error: Joi.string(),
                    message: Joi.string().default("Bad Request"),
                    data: Joi.object()
                }).label('Response')
            },
            '401': {
                'description': 'Unauthorized',
                'schema': Joi.object({
                    statusCode: Joi.number().default('401'),
                    error: Joi.string(),
                    message: Joi.string(),
                    attributes: Joi.object()
                }).label('Response')
            },
            '403': {
                'description': 'Forbidden',
                'schema': Joi.object({
                    statusCode: Joi.number().default('403'),
                    error: Joi.string().default("Forbidden"),
                    message: Joi.string().default("Insufficient scope")
                }).label('Response')
            },
            '500': {
                'description': 'Server Errors',
                'schema': Joi.object({
                    statusCode: Joi.number().default('50X'),
                    error: Joi.string(),
                    message: Joi.string(),
                    data: Joi.object()
                }).label('Response')
            }
        }
    },
    saltRounds: 10 // salt rounds for Bcrypt
}