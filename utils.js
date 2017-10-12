'use strict';

const config = require('config');

const Logger = require('./Libs/logger');
const statusCodes = require('./config/statusCodes');

module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
    failActionFunction
}


/**
 * Compresses a given response object and sends it.
 * @param  {object} response    Contains the final result of any API
 * @param  {stream} res         express res stream
 */
function sendSuccessResponse(response, res) {
    if (!response.flag) {
        response.flag = statusCodes.OK
    }
    if (!response.message) {
        response.message = statusCodes.getStatusText(statusCodes.OK);
    }
    return res(response);
}

/**
 * Sends a response in case of an error
 * @param  {object} error       {responseFlag, responseMessage}
 * @param  {stream} res         express res stream
 */
function sendErrorResponse(error, res) {
    if (!error.responseFlag) {
        error.responseFlag = statusCodes.METHOD_FAILURE;
    }
    if (!error.responseMessage) {
        error.responseMessage =
            error.message ||
            statusCodes.getStatusText(statusCodes.METHOD_FAILURE);
    }
    let response = {
        flag: error.responseFlag,
        message: error.responseMessage
    };
    if (error.addnInfo) {
        for (let key in error.addnInfo) {
            response[key] = error.addnInfo[key];
        }
    }
    Logger.winstonLogger.error({
        ERROR: error
    });
    res(response);
}


function failActionFunction(request, reply, source, error) {
    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation;
    return reply(error);
};