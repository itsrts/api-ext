/*jshint multistr: true ,node: true*/
"use strict";

function sampleFile(config) {
    let { className, method, route } = config;
    return `
/*jshint multistr: true ,node: true*/
"use strict";

const ServerRequest = require('api-ext').ServerRequest;

class ${className} extends ServerRequest {

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
        return "Hello !! This is a sample response from class '${className}'";
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
     * @returns {${className}}  
     */
    listen(opts) {
        if(object === null) {
            object = new ${className}(opts);
        }
        return object;
    }
};
`;
}

function sampleRoute(config) {
    let { fileName, method, route } = config;
    return `
require('./${fileName}').listen({
    method : '${method}',
    route: '${route}',
    schema: null,
    validator: null
});
`;
}

function samplePackage(config) {
    let { name, version, description, main, keywords, author, license, git_url } = config;
    let keywordsArr = "[";
    [].forEach(value => {
        keywordsArr += "'" + value + "'";
    });
    keywordsArr += "]";
    let content = `
{
  "name": "${name}",
  "version": "${version}",
  "description": "${description}",
  "main": "${main}",
  "scripts": {
  },
  "keywords": ${keywordsArr},
  "author": "${author}",
  "license": "${license}",
  "bin": {
  },
  "dependencies": {
  },
  "directories": {
  },
  "devDependencies": {}`;
    if (git_url) {
        content += `,
  "repository": {
    "type": "git",
    "url": "git+${git_url}.git"
  },
  "bugs": {
    "url": "${git_url}/issues"
  },
  "homepage": "${git_url}#readme"
}`;
    } else {
        content += `
}`;
    }

    return content;
}

module.exports = {
    sampleFile,
    sampleRoute,
    samplePackage
};