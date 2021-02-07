import { MiddlewareError } from "./errors";
import { HttpMethod } from "./http";
import { RouterOptions } from "./options";
import { ApiRequest } from "./request";
import { ApiResponse } from "./response";
import { getPathKeys, getPathValues, normalizePath } from "./utils";

export declare type HandlerFunction = (
  request: ApiRequest,
  response: ApiResponse
) => void | any | Promise<any>;

export interface Route {
  path: string;
  method: string;
  handler: HandlerFunction;
}

export interface RouteParams {
  [key: string]: string | undefined;
}

export function getRouteParams(
  route: string,
  path: string
): RouteParams | undefined {
  const pathNames = getPathKeys(route);
  const pathValues = getPathValues(route, path);

  if (pathNames && pathValues) {
    const params: RouteParams = {};

    for (let i = 0; i < pathNames.length; i++) {
      const name = pathNames[i];
      const value = pathValues[i];

      params[name] = value;
    }

    return params;
  }

  return undefined;
}

export class ApiRouter {
  private _routes: Route[] = [];
  private _middlewares: HandlerFunction[] = [];

  constructor(private options?: RouterOptions) {}

  use(handler: HandlerFunction): ApiRouter {
    if (typeof handler !== "function") throw new MiddlewareError();

    this._middlewares.push(handler);

    return this;
  }

  get(path: string, handler: HandlerFunction): ApiRouter {
    this.addRoute(path, HttpMethod.GET, handler);

    return this;
  }

  post(path: string, handler: HandlerFunction): ApiRouter {
    this.addRoute(path, HttpMethod.POST, handler);

    return this;
  }

  put(path: string, handler: HandlerFunction): ApiRouter {
    this.addRoute(path, HttpMethod.PUT, handler);

    return this;
  }
  patch(path: string, handler: HandlerFunction): ApiRouter {
    this.addRoute(path, HttpMethod.PATCH, handler);

    return this;
  }

  delete(path: string, handler: HandlerFunction): ApiRouter {
    this.addRoute(path, HttpMethod.DELETE, handler);

    return this;
  }

  routes(): Route[] {
    return this._routes;
  }

  middlewares(): HandlerFunction[] {
    return this._middlewares;
  }

  private createRoute(path: string): string {
    let newPath = path;

    if (this.options?.version) newPath = `${this.options.version}${newPath}`;
    if (this.options?.basePath) newPath = `${this.options.basePath}${newPath}`;

    return normalizePath(newPath);
  }

  private addRoute(
    path: string,
    method: string,
    handler: HandlerFunction
  ): void {
    this._routes.push({
      path: this.createRoute(path),
      method,
      handler,
    });
  }
}
