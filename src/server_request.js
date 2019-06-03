/*jshint multistr: true ,node: true*/
"use strict";

const
    SERVER = require('./server').getInstance(),
    _ = require('lodash'),
    L = require('./logger'),
    CODES = require('./http_codes'),
    validator = require('./schema_validator');

const RequestData = {
    headers: {},
    body: {},
    queryparams: {},
    pathparams: {},
    cookies: {},
    path: '',
    host: '',
    url: '',
    method: ''
};

const prepareRequestData = (request, response) => {
    return  {
        headers: request.headers,
        body: request.body,
        queryparams: request.query,
        pathparams: request.params,
        cookies: request.headers.cookies,
        path: request.path,
        host: request.hostname,
        url: request.url,
        method: request.method
    };
}

class ServerRequest {

    /**
     * @param config {{method : string, route : string, schema : JSON, validator : Function}} config 
     */
    constructor(config) {
        this.setRequestBodySchema(config.schema);
        SERVER.add(config.method, config.route, (req, res) => {
            this.execute(req, res);
        }, config.validator);
    }

    setRequestBodySchema(requestSchema) {
        this.requestSchema = requestSchema;
        return this;
    }

    /**
     * The function resolves a promise if there is not requestSchema
     * Else it validates the passed JSON with the requestSchema
     * @param {RequestData} data the data to be validated
     */
    sanityChecks(data) {
        if (this.requestSchema) {
            let result = validator.validate(data, this.requestSchema);
            if (!result.valid) {
                L.error("Schema validation failed for reason: " + result.error);
                throw {
                    code: 412,
                    status: 'Invalid Request body'
                };
            }
        }
    }

    /**
     * Do the actuall processing for the request and return the result
     * @param {RequestData} data 
     * @param {*} request 
     */
    process(data, request, response) {
        return data;
    }

    /**
     * 
     * @param {RequestData} data
     * @param {*} result the result of the process
     */
    makeResponse(data, result, request, response) {
        return {
            statusCode: 200,
            body: result
        };
    }

    /**
     * @returns {{code: number, status: string}}
     */
    handleError(data, error, request, response) {
        console.log(error);
        return {
            statusCode: CODES.isValidCode(error.code || error.statusCode) ? error.code : 500,
            body: {
                code: CODES.isValidCode(error.code || error.statusCode) ? error.code : 500,
                status: error.status || 'Internal Server Error'
            }
        };
    }

    /**
     * Used to support, async process.
     * The process doesn't concern the sync response sent with the request
     * 
     * @param {*} request 
     * @param {RequestData} data 
     * @param {JSON} result 
     */
    postProcess(data, result, request, response) {
        // To be overridden
    }

    /**
     * 
     * @param {*} request 
     * @param {Server.} response 
     */
    async execute(request, response) {

        // Object.assign(body, query, params);
        let data = prepareRequestData(request, response);

        try {
            await this.sanityChecks(data);
            let result = await this.process(request, data, response);
            result = await this.makeResponse(data, result, request, response);
            if (result.statusCode && result.body) {
                response.sendResponse(result.statusCode, result.body);
            } else {
                response.sendResponse(200, result);
            }
            this.postProcess(data, result, request, response);
        } catch (error) {
            if (error === ServerRequest.RESPONSE_SENT) {
                return;
            }
            error = await this.handleError(request, data, error);
            response.sendResponse(error.statusCode, error.body);
        }
    }
}

ServerRequest.RESPONSE_SENT = 'THE RESPONSE IS ALREADY HANDLED/SENT';

module.exports = ServerRequest;