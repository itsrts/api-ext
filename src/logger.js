/*jshint multistr: true ,node: true*/
"use strict";

let winston = require('winston');

const level = process.env.logLevel || 'silly';

const L = winston.createLogger({
    level: level,
    format: winston.format.json(),
    defaultMeta: '',
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    L.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

L.info('Logger testing');

module.exports = L;

