/*jshint multistr: true ,node: true*/
"use strict";

require('./routes');

require('../src').Server.getInstance().start();