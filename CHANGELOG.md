# Change Log

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [1.2.3] - 2020-02-22

### Added
- The `toError()` method is added in the response class.

## [1.2.2] - 2020-02-21

### Changed
- The request properties have been updated by adding the `connectionId` and `route` properties.
- Example of how to send a message from the server to the application.

## [1.2.1] - 2020-02-21

### Changed
- Update documentation about the response actions `connect` and `disconnect`.

## [1.2.0] - 2020-02-20

### Added
- The component `socket` is added.

### Changed
- Fixed middleware response by problem with router response.

## [1.1.3] - 2020-02-16

### Changed
- Fixed headers in the `response` headers.

## [1.1.2] - 2020-02-13

### Changed
- Fixed the `request id` in the method `listen` the `api`.

## [1.1.1] - 2020-02-13

### Changed
- Move the trace `request` to the first lines of code the method `listen`.
- Separate `handleErrors()` in two variables `Response` and `ResponseError`.

## [1.1.0] - 2020-02-09

### Added
- The component `logger` is added.
- The logger works with `process.stdout.write` and `process.stderr.write`.
- Enable api options.
  
### Changed
- Refactor the class `request` by the logger support.
- Change the method `getResponse()` to `toResponse()`.

## [1.0.3] - 2020-02-08

### Added
- the `libs` code is minified using `terser`.

## [1.0.2] - 2020-02-07

### Changed
- Fixed when requestContext is empty
- The default value of http method is GET
- Fixed when payload in the response.send() is undefined. Return by default string empty.

## [1.0.1] - 2020-02-07

### Added
- Integration with Gateway Lambda Proxy Integrator API using REST API or HTTP API.
- Integration with ALB Lambda Target Support.
- Enabling CORS for requests.
- No external dependencies.
- You can use the separate `Request` and `Response`.
- The final middleware router runs after all routes and middleware have completed.
- Creation of multiple routers with different versions.
- Typescript support.

## 1.0.0 - 2020-02-07

### Added
- Structure project

[1.2.3]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.2.3
[1.2.2]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.2.2
[1.2.1]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.2.1
[1.2.0]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.2.0
[1.1.3]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.1.3
[1.1.2]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.1.2
[1.1.1]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.1.1
[1.1.0]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.1.0
[1.0.3]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.0.3
[1.0.2]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.0.2
[1.0.1]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.0.1
