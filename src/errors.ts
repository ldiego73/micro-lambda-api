export const ApiError = {
  GENERIC_ERROR: "GENERIC_ERROR",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  MIDDLEWARE_ERROR: "MIDDLEWARE_ERROR",
  ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
};

export class HttpError extends Error {
  constructor(public code: string, public message: string) {
    super(message);
  }
}

export class MethodError extends HttpError {
  constructor(public path: string, public method: string) {
    super(ApiError.METHOD_NOT_ALLOWED, "Method Not Allowed");

    this.name = this.constructor.name;
  }
}

export class RouteError extends HttpError {
  constructor(public path: string) {
    super(ApiError.ROUTE_NOT_FOUND, "Route not found");

    this.name = this.constructor.name;
  }
}

export class MiddlewareError extends HttpError {
  constructor() {
    super(ApiError.MIDDLEWARE_ERROR, "Middleware is invalid");

    this.name = this.constructor.name;
  }
}
