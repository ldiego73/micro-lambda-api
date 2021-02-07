export declare const ApiError: {
    GENERIC_ERROR: string;
    METHOD_NOT_ALLOWED: string;
    MIDDLEWARE_ERROR: string;
    ROUTE_NOT_FOUND: string;
};
export declare class HttpError extends Error {
    code: string;
    message: string;
    constructor(code: string, message: string);
}
export declare class MethodError extends HttpError {
    path: string;
    method: string;
    constructor(path: string, method: string);
}
export declare class RouteError extends HttpError {
    path: string;
    constructor(path: string);
}
export declare class MiddlewareError extends HttpError {
    constructor();
}
