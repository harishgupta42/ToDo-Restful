'use strict';

const HapiSwagger = require('hapi-swagger-next');
const Inert = require('inert');
const Vision = require('vision');

const Logger = require('../Libs/logger');

// Register Swagger
exports.register = (server, options, next) => {

    server.register([
        Inert,
        Vision,
        {
            'register': HapiSwagger,
            'options': {
                'info': {
                    'title': 'NodeJS-ToDo-RESTful-API',
                    'version': '1.0.0'
                },
                'pathPrefixSize': 3,
                'payloadType': 'json',
                'jsonEditor': false,
                'grouping': 'tags',
                'consumes': ['application/json', 'application/x-www-form-urlencoded'],
                'produces': ['application/json', 'application/x-www-form-urlencoded']
            }
        }
    ], (err) => {
        if (err) {
            Logger.winstonLogger.error({
                ERROR: error
            });
        } else {
            Logger.winstonLogger.info('Hapi-Swagger interface loaded')
        }
    });
    next();
};

exports.register.attributes = {
    name: 'swagger-plugin'
};