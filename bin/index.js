#!/usr/bin/env node

var util = require('./util');


var path = process.argv[2];
var fileName = '';

if (process.argv.length < 4) {
    util.usage();
    process.exit();
}

var cmd = process.argv[2];
var path = process.argv[3];

switch (cmd) {
    case 'usage':
        util.usage();
        break;

    case 'init':
        util.kickStart(path);
        break;

    case 'module':
        util.createModule(path);
        break;

    case 'request':
        if (path.indexOf('/') >= 0) {
            fileName = path.split("/");
            fileName = fileName[fileName.length - 1];
            if (!fileName.endsWith('.js')) {
                fileName = '';
            }
        }
        else {
            fileName = path;
        }

        var className = fileName.replace(".js", "");
        // class name conventions
        className = className.charAt(0).toUpperCase() + className.slice(1);

        let config = {
            className: className,
            fileName: fileName,
            method: '',
            path: path,
            route: ''
        };
        util.addRoutes(config);
        break;
    
        case 'env':
            // if the number of parameters are not sufficient
            if(process.argv.length < 5) {
                util.usage();
                process.exit();
            }
            let env = process.argv[3];
            let envConfig = process.argv[4];
            util.CreateOrUpdateEnv(env, envConfig);
            break;
    
    default:
        util.usage();
}
