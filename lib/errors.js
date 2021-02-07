"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareError = exports.RouteError = exports.MethodError = exports.HttpError = exports.ApiError = void 0;
exports.ApiError = {
    GENERIC_ERROR: "GENERIC_ERROR",
    METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
    MIDDLEWARE_ERROR: "MIDDLEWARE_ERROR",
    ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
};
class HttpError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
exports.HttpError = HttpError;
class MethodError extends HttpError {
    constructor(path, method) {
        super(exports.ApiError.METHOD_NOT_ALLOWED, "Method Not Allowed");
        this.path = path;
        this.method = method;
        this.name = this.constructor.name;
    }
}
exports.MethodError = MethodError;
class RouteError extends HttpError {
    constructor(path) {
        super(exports.ApiError.ROUTE_NOT_FOUND, "Route not found");
        this.path = path;
        this.name = this.constructor.name;
    }
}
exports.RouteError = RouteError;
class MiddlewareError extends HttpError {
    constructor() {
        super(exports.ApiError.MIDDLEWARE_ERROR, "Middleware is invalid");
        this.name = this.constructor.name;
    }
}
exports.MiddlewareError = MiddlewareError;
