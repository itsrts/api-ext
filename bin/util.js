
var fs = require("fs");
const chalk = require('chalk');

// usage represents the help guide
const usage = function () {
    const usageText = `
api-ext helps you manage you apis and have them extensible.

${chalk.underline('usage:')}
    api-ext <command>

    module    :   used to create a new module
    request   :   used to create a new request to a module/given path
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

    var inquirer = require('inquirer');
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
            try {
                fs.writeFileSync(path, fileData);
            } catch (error) {
                console.log(chalk.red("\nThere was some error, Please check if the modules are created for the path"));
                console.log(path);
                usage();
                process.exit();
            }
            try {
                // add to routes
                path = path.replace(fileName, 'routes.js');
                fs.readFileSync(path, 'utf-8');
                fs.appendFileSync(path, routeData);
                console.log(chalk.green("\nRoute Added"));
            } catch (error) {
                console.log(chalk.yellow("Creating the route file"));
                fs.writeFileSync(path, routeData);
                console.log(chalk.green("\nRoute Added"));
            }
        });
}

const createModule = function (path) {
    fs.writeFileSync(`${path}/index.js`, `
/*jshint multistr: true ,node: true*/
"use strict";

require('./routes');
`);

    fs.writeFileSync(`${path}/routes.js`, `
/*jshint multistr: true ,node: true*/
"use strict";
`);
}

module.exports = {
    usage,
    addRoutes,
    createModule
}