
/*jshint multistr: true ,node: true*/
"use strict";

require('./test.js').listen({
    method : 'GET',
    route: '/test',
    schema: null,
    validator: null
});
