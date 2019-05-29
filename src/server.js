/*jshint multistr: true ,node: true*/
"use strict";

const Express = require('express');
const BODYPARSER = require('body-parser');
const COOKIEPARSER = require('cookie-parser');

class Server {

    constructor() {
        this.app = new Express();
        this.app.use(COOKIEPARSER());
        this.app.use(Express.static('public'));
        this.app.use(BODYPARSER.json());
        this.app.use(BODYPARSER.urlencoded({ extended: false }));
    }

    start(port) {
        port = port || 8080;
        this.app.listen(port, () => {
            console.log("server started at port", port);
        });
    }

    /**
     * Adds a new route to the server with the passed handler as the listener
     * @param {string} method GET, POST, PUT, DELETE 
     * @param {string} path the route for the request
     * @param {function} handler the function to be called
     */
    add(method, path, handler, validator) {
        if (!validator) {
            validator = (req, res, next) => { next(); };
        }
        this.app[method.toLowerCase()](path, validator, (req, res) => {
            res.sendResponse = function (statusCode, data) {
                res.responseBody = data;
                this.status(statusCode).send(data);
            };
            handler(req, res);
        });
        return this;
    }
}

let obj = null;

module.exports = {

    /**
     * @returns {Server}
     */
    getInstance() {
        if (obj == null) {
            obj = new Server();
        }
        return obj;
    }
};