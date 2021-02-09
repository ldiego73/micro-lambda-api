import { ApiError, HttpError, MethodError, RouteError } from "./errors";
import { HttpStatus } from "./http";
import { Logger, LoggerOptions, LogHandlerFunction } from "./logger";
import { ApiRequest } from "./request";
import { ApiResponse, Response, ResponseError } from "./response";
import { getRouteParams, HandlerFunction, Route, RouteParams } from "./router";

export interface ApiOptions {
  logger?: ApiOptionsLogger;
}

export interface ApiOptionsLogger {
  trace?: boolean;
  pretty?: boolean;
  handler?: LogHandlerFunction;
}
export class Api {
  private routes: Route[] = [];
  private middlewares: HandlerFunction[] = [];
  private middlewareFinally?: HandlerFunction;

  readonly log = Logger.create();

  constructor(private options: ApiOptions = {}) {}

  use(middlewares: Route[] | HandlerFunction[]): Api {
    for (const m of middlewares) {
      if (typeof m === "function") {
        this.middlewares.push(m);
      } else {
        this.routes.push(m);
      }
    }

    return this;
  }

  finally(handler: HandlerFunction): void {
    /* istanbul ignore else */
    if (typeof handler === "function") this.middlewareFinally = handler;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async listen(event: any, context: any): Promise<Response> {
    const request = new ApiRequest(event, context);
    const loggerOptions: LoggerOptions = { context };

    if (typeof this.options.logger !== "undefined") {
      loggerOptions.pretty = this.options.logger.pretty || undefined;
      loggerOptions.handler = this.options.logger.handler || undefined;
    }

    Logger.configure(loggerOptions);

    const isTrace = this.options.logger?.trace || false;

    try {
      if (!this.routes.length) {
        throw new RouteError(request.path);
      }

      const matchingMethodRoutes = this.routes.filter(
        (r) => r.method === request.method
      );

      if (matchingMethodRoutes.length === 0) {
        throw new MethodError(request.method, request.path);
      }

      const routeMatched = this.matchRoute(matchingMethodRoutes, request.path);

      if (!routeMatched) {
        throw new RouteError(request.path);
      }

      const response = new ApiResponse(request);
      const [route, params] = routeMatched;

      request.params = params;

      if (isTrace) this.trace("REQUEST", "request", request.toRequest());

      await this.executeMiddlewares(request, response);

      const responseHandler = await route.handler(request, response);
      const responseApi = response.toResponse();

      /* istanbul ignore else */
      if (this.middlewareFinally)
        await this.middlewareFinally(request, response);

      const result = responseApi || response.send(responseHandler);

      if (isTrace) this.trace("RESPONSE", "response", result);

      return result;
    } catch (err: any) {
      const error = this.handleErrors(err, request);

      if (isTrace) this.trace("ERROR", "error", error);

      return error;
    }
  }

  private trace(message: string, key: string, value: any): void {
    this.log.clearExtras();
    this.log.addExtra(key, value);
    this.log.trace(message);
  }

  private async executeMiddlewares(
    request: ApiRequest,
    response: ApiResponse
  ): Promise<any> {
    for (let i = 0; i < this.middlewares.length; i++) {
      const middleware = this.middlewares[i];

      await middleware(request, response);
    }
  }

  private matchRoute(
    routes: Route[],
    path: string
  ): [Route, RouteParams] | undefined {
    for (const route of routes) {
      const params = getRouteParams(route.path, path);

      if (params) {
        return [route, params];
      }
    }

    return undefined;
  }

  private handleErrors(err: any, request: ApiRequest): Response {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    const response = new ApiResponse(request);
    const responseError: ResponseError = {
      code: ApiError.GENERIC_ERROR,
      message: err.message || "",
      status,
    };

    if (err instanceof HttpError) {
      responseError.code = err.code;

      if (err instanceof MethodError) {
        status = HttpStatus.METHOD_NOT_ALLOWED;

        responseError.status = status;
        responseError.data = {
          method: err.method,
          path: err.path,
        };
      } else if (err instanceof RouteError) {
        status = HttpStatus.NOT_FOUND;

        responseError.status = status;
        responseError.data = {
          path: err.path,
        };
      }
    }

    return response.status(status).error(responseError);
  }
}
