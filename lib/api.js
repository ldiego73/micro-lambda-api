"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const errors_1 = require("./errors");
const http_1 = require("./http");
const request_1 = require("./request");
const response_1 = require("./response");
const router_1 = require("./router");
class Api {
    constructor() {
        this.routes = [];
        this.middlewares = [];
    }
    use(middlewares) {
        for (const m of middlewares) {
            if (typeof m === "function") {
                this.middlewares.push(m);
            }
            else {
                this.routes.push(m);
            }
        }
        return this;
    }
    finally(handler) {
        this.middlewareFinally = handler;
    }
    async listen(event, context) {
        const request = request_1.ApiRequest(event, context);
        try {
            if (!this.routes.length) {
                throw new errors_1.RouteError(request.path);
            }
            const matchingMethodRoutes = this.routes.filter((r) => r.method === request.method);
            if (matchingMethodRoutes.length === 0) {
                throw new errors_1.MethodError(request.method, request.path);
            }
            const routeMatched = this.matchRoute(matchingMethodRoutes, request.path);
            if (!routeMatched) {
                throw new errors_1.RouteError(request.path);
            }
            const response = new response_1.ApiResponse(request);
            const [route, params] = routeMatched;
            request.params = params;
            await this.executeMiddlewares(request, response);
            const responseHandler = await route.handler(request, response);
            const responseApi = response.getResponse();
            if (this.middlewareFinally)
                await this.middlewareFinally(request, response);
            return responseApi || response.send(responseHandler);
        }
        catch (err) {
            return this.handleErrors(err, request);
        }
    }
    async executeMiddlewares(request, response) {
        for (let i = 0; i < this.middlewares.length; i++) {
            const middleware = this.middlewares[i];
            await middleware(request, response);
        }
    }
    matchRoute(routes, path) {
        for (const route of routes) {
            const params = router_1.getRouteParams(route.path, path);
            if (params) {
                return [route, params];
            }
        }
        return undefined;
    }
    handleErrors(err, request) {
        const response = new response_1.ApiResponse(request);
        const responseError = {
            code: errors_1.ApiError.GENERIC_ERROR,
            message: err.message || "",
        };
        if (err instanceof errors_1.HttpError) {
            responseError.code = err.code;
            if (err instanceof errors_1.MethodError) {
                responseError.status = http_1.HttpStatus.METHOD_NOT_ALLOWED;
                responseError.data = {
                    method: err.method,
                    path: err.path,
                };
            }
            else if (err instanceof errors_1.RouteError) {
                responseError.status = http_1.HttpStatus.NOT_FOUND;
                responseError.data = {
                    path: err.path,
                };
            }
        }
        return response.error(responseError);
    }
}
exports.Api = Api;
