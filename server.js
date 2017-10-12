'use strict';
if (
    process.env.NODE_ENV !== 'development' &&
    process.env.NODE_ENV !== 'production'
) {
    console.log(
        `Please specify one of the following environments to run your server
            - development
            - production
            
    Example : NODE_ENV=development pm2 start server.js`
    );
    throw 'abc';
    return '';
}

process.env.NODE_CONFIG_DIR = __dirname + '/config/';

/* Node Modlules */
const Hapi = require('hapi');
const config = require('config');
const path = require('path');
const promise = require('bluebird');


const Plugins = require('./Plugins');
const Routes = require('./Routes');
const Controllers = require('./Controllers');
const Logger = require('./Libs/logger');

// Create Server
let server = new Hapi.Server({
    app: {
        name: 'Provide app name'
    }
});

global.Promise = promise;
global.server = server;
server.connection({
    host: config.get('host'),
    port: config.get('port'),
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: []
        }
    }
});

// Register All Plugins
server.register(Plugins, function (err) {
    if (err) {
        Logger.winstonLogger.error({
            ERROR: error
        });
        server.error('Error while loading plugins : ' + err);
    } else {

        server.log('Plugins Loaded');
    }
});

// Default Routes
server.route({
    method: 'GET',
    path: '/ping',
    handler: function (request, reply) {
        reply(200, {
            pong: true
        }).code(200);
    }
    /* config: {
         cors: {
             origin: ['*'],
             additionalHeaders: ['cache-control', 'x-requested-with']
         }
     }*/
});

//API Routes
server.route(Routes);

server.on('response', function (request) {});

//Start Server
server.start(function () {
    Logger.winstonLogger.info(`Server running at ${server.info.uri}`);
});