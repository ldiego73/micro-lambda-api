import { RouterOptions } from "./options";
import { Request } from "./request";
import { ApiResponse } from "./response";
export declare type HandlerFunction = (request: Request, response: ApiResponse) => void | any | Promise<any>;
export interface Route {
    path: string;
    method: string;
    handler: HandlerFunction;
}
export interface RouteParams {
    [key: string]: string | undefined;
}
export declare function getRouteParams(route: string, path: string): RouteParams | undefined;
export declare class ApiRouter {
    private options?;
    private _routes;
    private _middlewares;
    private _middlewareFinally?;
    constructor(options?: RouterOptions | undefined);
    use(handler: HandlerFunction): ApiRouter;
    end(handler: HandlerFunction): ApiRouter;
    get(path: string, handler: HandlerFunction): ApiRouter;
    post(path: string, handler: HandlerFunction): ApiRouter;
    put(path: string, handler: HandlerFunction): ApiRouter;
    patch(path: string, handler: HandlerFunction): ApiRouter;
    delete(path: string, handler: HandlerFunction): ApiRouter;
    routes(): Route[];
    middlewares(): HandlerFunction[];
    finally(): HandlerFunction;
    private createRoute;
    private addRoute;
}
