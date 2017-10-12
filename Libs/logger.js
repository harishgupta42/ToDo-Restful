'use strict';
const winston = require('winston');


// converts the date object to local time string
const tsFormat = () => (new Date()).toLocaleTimeString();

// winston logger to generate logs
const winstonLogger = new(winston.Logger)({
    transports: [
        // colorize the output to the console
        new(winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'verbose' // level of log
        })
    ]
});

module.exports = {
    winstonLogger: winstonLogger
};