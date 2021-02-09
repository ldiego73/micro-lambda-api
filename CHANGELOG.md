# Change Log

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

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
- You can use the separate Request and Response. Without requiring the final
- Midleware router to run after all middleware and routes have been completed.
- Creating multiple routers to handle different versions.
- Typescript support

## 1.0.0 - 2020-02-07

### Added
- Structure project

[1.1.0]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.1.0
[1.0.3]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.0.3
[1.0.2]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.0.2
[1.0.1]: https://github.com/ldiego73/micro-lambda-api/releases/tag/1.0.1
