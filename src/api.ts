import {
  ApiError,
  HttpError,
  MethodError,
  RouteError,
  ActionError,
} from "./errors";
import { HttpIntegration, HttpStatus } from "./http";
import { Logger, LoggerOptions, LogHandlerFunction } from "./logger";
import { HandlerFunction } from "./options";
import { ApiRequest } from "./request";
import { ApiResponse, Response, ResponseError } from "./response";
import { getRouteParams, instanceOfRoute, Route, RouteParams } from "./router";
import { Action, instanceOfAction, isDefaultAction } from "./socket";

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
  private actions: Action[] = [];
  private middlewares: HandlerFunction[] = [];
  private middlewareFinally?: HandlerFunction;

  readonly log = Logger.create();

  constructor(private options: ApiOptions = {}) {}

  use(middlewares: Route[] | Action[] | HandlerFunction[]): Api {
    for (const m of middlewares) {
      /* istanbul ignore else */
      if (typeof m === "function") {
        this.middlewares.push(m);
      } else if (instanceOfRoute(m)) {
        this.routes.push(m);
      } else if (instanceOfAction(m)) {
        this.actions.push(m);
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
    const response = new ApiResponse(request);
    const loggerOptions: LoggerOptions = { context };
    const isTrace = this.options.logger?.trace || false;

    if (typeof this.options.logger !== "undefined") {
      loggerOptions.pretty = this.options.logger.pretty || undefined;
      loggerOptions.handler = this.options.logger.handler || undefined;
    }

    Logger.configure(loggerOptions);

    if (isTrace) this.trace("REQUEST", "request", request.toRequest());

    try {
      let responseHandler: any;

      if (request.proxyIntegration === HttpIntegration.APIGW_WS_API) {
        const action = this.findAction(request);

        await this.executeMiddlewares(request);

        responseHandler = await action.handler(request, response);
      } else {
        const [route, params] = this.findRoute(request);

        await this.executeMiddlewares(request);

        request.params = params;
        responseHandler = await route.handler(request, response);
      }

      const responseApi = response.toResponse();
      const result = responseApi || response.send(responseHandler);

      /* istanbul ignore else */
      if (this.middlewareFinally) await this.middlewareFinally(request, response);

      if (isTrace) this.trace("RESPONSE", "response", result);

      return result;
    } catch (err: any) {
      const [result, error] = this.handleErrors(err, request);

      if (isTrace) this.trace("ERROR", "error", error);

      return result;
    }
  }

  private trace(message: string, key: string, value: any): void {
    this.log.clearExtras();
    this.log.addExtra(key, value);
    this.log.trace(message);
  }

  private findRoute(request: ApiRequest): [Route, RouteParams] {
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

    return routeMatched;
  }

  private findAction(request: ApiRequest): Action {
    if (!this.actions.length) {
      throw new ActionError(request.route);
    }

    const requestAction = request.body.action || "";
    const actionMatched = this.actions.find((a) => {
      if (isDefaultAction(request.route)) {
        return a.name === requestAction;
      }
      return a.name === request.route;
    });

    if (!actionMatched) {
      throw new ActionError(request.route);
    }

    return actionMatched;
  }

  private async executeMiddlewares(request: ApiRequest): Promise<any> {
    const response = new ApiResponse(request);
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

  private handleErrors(
    err: any,
    request: ApiRequest
  ): [Response, ResponseError] {
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
      } else if (err instanceof ActionError) {
        status = HttpStatus.NOT_FOUND;

        responseError.status = status;
        responseError.data = {
          name: err.name,
        };
      }
    }

    return [response.status(status).error(responseError), responseError];
  }
}
