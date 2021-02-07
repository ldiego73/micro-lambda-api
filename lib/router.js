"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = exports.getRouteParams = void 0;
const errors_1 = require("./errors");
const http_1 = require("./http");
const utils_1 = require("./utils");
function getRouteParams(route, path) {
    const pathNames = utils_1.getPathKeys(route);
    const pathValues = utils_1.getPathValues(route, path);
    if (pathNames && pathValues) {
        const params = {};
        for (let i = 0; i < pathNames.length; i++) {
            const name = pathNames[i];
            const value = pathValues[i];
            params[name] = value;
        }
        return params;
    }
    return undefined;
}
exports.getRouteParams = getRouteParams;
class ApiRouter {
    constructor(options) {
        this.options = options;
        this._routes = [];
        this._middlewares = [];
    }
    use(handler) {
        if (typeof handler !== "function")
            throw new errors_1.MiddlewareError();
        this._middlewares.push(handler);
        return this;
    }
    get(path, handler) {
        this.addRoute(path, http_1.HttpMethod.GET, handler);
        return this;
    }
    post(path, handler) {
        this.addRoute(path, http_1.HttpMethod.POST, handler);
        return this;
    }
    put(path, handler) {
        this.addRoute(path, http_1.HttpMethod.PUT, handler);
        return this;
    }
    patch(path, handler) {
        this.addRoute(path, http_1.HttpMethod.PATCH, handler);
        return this;
    }
    delete(path, handler) {
        this.addRoute(path, http_1.HttpMethod.DELETE, handler);
        return this;
    }
    routes() {
        return this._routes;
    }
    middlewares() {
        return this._middlewares;
    }
    createRoute(path) {
        var _a, _b;
        let newPath = path;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.version)
            newPath = `${this.options.version}${newPath}`;
        if ((_b = this.options) === null || _b === void 0 ? void 0 : _b.basePath)
            newPath = `${this.options.basePath}${newPath}`;
        return utils_1.normalizePath(newPath);
    }
    addRoute(path, method, handler) {
        this._routes.push({
            path: this.createRoute(path),
            method,
            handler,
        });
    }
}
exports.ApiRouter = ApiRouter;
