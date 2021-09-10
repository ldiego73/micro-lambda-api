import { MiddlewareError } from "./errors";
import { HttpMethod } from "./http";
import { HandlerFunction, RouterOptions } from "./options";
import { getPathKeys, getPathValues, normalizePath } from "./utils";
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const instanceOfRoute = (middleware: any): middleware is Route =>
  "path" in middleware && "method" in middleware;

export class ApiRouter {
  private _routes: Route[] = [];
  private _middlewares: HandlerFunction[] = [];

  constructor(private _options?: RouterOptions) {}

  use(handler: HandlerFunction): ApiRouter {
    if (typeof handler !== "function") throw new MiddlewareError();

    this._middlewares.push(handler);

    return this;
  }

  options(path: string, handler: HandlerFunction): ApiRouter {
    this.addRoute(path, HttpMethod.OPTIONS, handler);

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

    if (this._options?.version) newPath = `${this._options.version}${newPath}`;
    if (this._options?.basePath) newPath = `${this._options.basePath}${newPath}`;

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
