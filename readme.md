
# api-ext

> An API framework in approach to build APIs with extensibility in mind

The framework is powered by express underneath.
It empowers module based programming in node.js and does a lot of heavy lifting by default.

Providing a clean code architecture, schema validations, error handling.
One can have a fresh server up and running in less than 30 seconds.

ServerRequest is a base class which controls the flow in the followin order:
1) sanityChecks
2) process
3) makeResponse
4) postProcess (done asynchronously)
5) handleError

The CLI provides the boilerplate code and you can always modify as required.

## Install globally as well

```
> npm install -g api-ext
> npm install api-ext
```

## Kick Start Application

```
> api-ext start
```

## Add new module

```js
> api-ext module my-module
```

## Add a request to the module

```js
> api-ext request my-module/firstApi.js
```

## Start the application and we are :)

```js
> node app.js

  server started at port 8080
```
