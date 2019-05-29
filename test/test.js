
/*jshint multistr: true ,node: true*/
"use strict";

const ServerRequest = require('../src').ServerRequest;

class Test extends ServerRequest {

    /**
     * @param opts {{method : string, route : string, schema : JSON, validator : Function}} config 
     */
    constructor(opts) {
        super({
            method      : opts.method,
            route       : opts.route,
            schema      : opts.schema,
            validator   : opts.validator
        });
    }

    process(data) {
        return "hello world";
    }

    makeResponse(data, result) {
        return {
            "response" : result
        };
    }
}

let object = null;
module.exports = {
    /**
     * @param opts {{method : string, route : string, schema : JSON, validator : Function}} config 
     * @returns {Test}  
     */
    listen(opts) {
        if(object === null) {
            object = new Test(opts);
        }
        return object;
    }
};
