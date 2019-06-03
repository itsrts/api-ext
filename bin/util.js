
var fs = require("fs");
const chalk = require('chalk');
const shell = require('shelljs');
var inquirer = require('inquirer');

// usage represents the help guide
const usage = function () {
    const usageText = `
api-ext helps you manage you apis and have them extensible.

${chalk.underline('usage:')}
    api-ext <command> <path/file>

    init      :   initialize a new project
    module    :   add a new module
    request   :   create a new request to a given module/path
`;

    console.log(chalk.red("\nSeems like you need some help with the commands"));
    console.log(usageText)
}

const addRoutes = function (config) {

    let { fileName, className, method, path, route } = config;

    var questions = [{
        type: 'input', name: 'file_name', message: "File name", default: function () { return fileName; }
    },
    {
        type: 'input', name: 'class_name', message: "Name of the Class", default: function () { return className; }
    },
    {
        type: 'input', name: 'route', message: "Route for the API", default: function () { return `/${className.toLowerCase()}`; }
    },
    {
        type: 'list', name: 'method', message: "API method",
        choices: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], filter: function (val) { return val.toUpperCase(); }
    }];

    inquirer
        .prompt(questions)
        .then(answers => {
            fileName = answers.file_name;
            className = answers.class_name;

            config = {
                className: className,
                fileName: fileName,
                method: answers.method,
                path: path,
                route: answers.route
            };
            var fileData = require('./sample').sampleFile(config);
            var routeData = require('./sample').sampleRoute(config);
            var schemaData = require('./sample').sampleSchema(config);
            try {
                // sample file
                fs.writeFileSync(path, fileData);
                console.log(chalk.green("\File Created"));
            } catch (error) {
                console.log(chalk.red("\nThere was some error, Please check if the modules are created for the path"));
                console.log(path);
                usage();
                process.exit();
            }
            // change path for routes file
            path = path.replace(fileName, 'routes.js');
            try {
                // add to routes
                fs.readFileSync(path, 'utf-8');
                fs.appendFileSync(path, routeData);
                console.log(chalk.green("\nRoute Added"));
            } catch (error) {
                console.log(chalk.red("\nThere was some error, Please check if the route was added"));
                console.log(path);
                process.exit();
            }
            // change path for schema file
            path = path.replace('routes.js', 'schema.js');
            try {
                // add to routes
                fs.readFileSync(path, 'utf-8');
                fs.appendFileSync(path, schemaData);
                console.log(chalk.green("\nSchema Added"));
            } catch (error) {
                console.log(chalk.red("\nThere was some error, Please check if the schema was added"));
                console.log(path);
                process.exit();
            }
        });
}

const kickStart = function (path) {
    var questions = [{
        type: 'input', name: 'name', message: "package name: ", default: function () { return path; }
    },
    {
        type: 'input', name: 'version', message: "version", default: function () { return "1.0.0"; }
    },
    {
        type: 'input', name: 'description', message: "description"
    },
    {
        type: 'input', name: 'main', message: "entry point", default: function () { return `index.js`; }
    },
    {
        type: 'input', name: 'git_url', message: "git repository"
    },
    {
        type: 'input', name: 'keywords', message: "keywords"
    },
    {
        type: 'input', name: 'author', message: "author"
    },
    {
        type: 'input', name: 'license:', message: "license:", default: function () { return `ISC`; }
    },
    {
        type: 'list', name: 'ok', message: "Is this OK?",
        choices: ['YES', 'NO'], filter: function (val) { return val.toUpperCase(); }
    }];

    inquirer
        .prompt(questions)
        .then(answers => {
            if(answers.ok != 'YES') {
                console.log(chalk.red('ABORTED..!!'));
                process.exit();
            } else {
                try {
                    shell.mkdir(path);
                    var fileData = require('./sample').samplePackage(answers);
                    fs.writeFileSync(path+'/package.json', fileData);
                } catch (error) {
                    console.log(chalk.red("\nThere was some error"), error);
                    process.exit();
                }
            }

    shell.cd(path);
    console.log("installing ...");
    console.log(shell.exec('npm install api-ext --save', { silent: true, async: false }).stdout);
    fs.writeFileSync('app.js', `
/*jshint multistr: true ,node: true*/
"use strict";

require('./routes');
require('api-ext').Server.getInstance().start();
`);

    fs.writeFileSync('routes.js', `
/*jshint multistr: true ,node: true*/
"use strict";

`);
        });
}

const createModule = function (path) {
    shell.mkdir(path);
    fs.writeFileSync(`${path}/index.js`, `
/*jshint multistr: true ,node: true*/
"use strict";

require('./routes');
`);

    fs.writeFileSync(`${path}/routes.js`, `
/*jshint multistr: true ,node: true*/
"use strict";

let schema = require('./schema');
`);


    fs.writeFileSync(`${path}/schema.js`, `
/*jshint multistr: true ,node: true*/
"use strict";

let schemas = {};
module.exports = schemas;
`);

    fs.appendFileSync('routes.js', `
require('./${path}');`);

console.log(chalk.green("\nModule Created"));
}

module.exports = {
    usage,
    kickStart,
    addRoutes,
    createModule
}