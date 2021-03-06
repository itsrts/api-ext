
# api-ext

> A framework to build APIs with modularity in mind

The framework is powered by express underneath.
It encourages module based programming in node.js and does a lot of heavy lifting by itself.

Providing a clean code architecture, schema validations, error handling.
One can have a fresh server up and running in less than 30 seconds.

ServerRequest is a base class which controls the flow in the followin order:
1) sanityChecks
2) process
3) makeResponse
4) postProcess (done asynchronously, after response is sent)
5) handleError

The CLI provides the boilerplate code and you can always modify as required.

## Install globally

```
> npm install -g api-ext
```

## init Project

```
> api-ext init project-name

> cd project-name
```

## Add new module (optional)

```js
> api-ext module mymodule
```

## Add a request

```js
> api-ext request mymodule/firstApi.js

OR

> cd mymodule
> api-ext request firstApi.js
```

## Start the application and we are :)

```js
> node app.js

  server started at port 8080
```

## To be noted

The CLI tool will prompt a few questions for creating a new request.

Request Schema Validator is very handy tool to validate incoming request before actually processing them.
api-ext uses the AJV library https://www.npmjs.com/package/ajv, It is very dynamic and extensible.
Here is the list of types available, https://github.com/epoberezkin/ajv/blob/master/KEYWORDS.md#type

#Environment Configurations

Adding an environment variable in a project is as simple as a single command. It will add the configuration to the selected environment. The default configuration is available in the `/env/base.js` file.
The folllowing command will add `somekey` attribute with `value` in the `dev` environment.
```js
> api-ext env dev somekey=value
```
As expected, it picks the environment from `NODE_ENV` environment variable

e.g. `NODE_ENV=dev node app.js` will  start the application in `dev` environment 

```js
// loads the selected environment and returns the configuration
let config = require('../env').getEnvConfig();
// using the port from the config
require('../src').Server.getInstance().start(config.port);
```
