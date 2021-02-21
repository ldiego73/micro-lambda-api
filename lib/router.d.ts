import { HandlerFunction, RouterOptions } from "./options";
export interface Route {
    path: string;
    method: string;
    handler: HandlerFunction;
}
export interface RouteParams {
    [key: string]: string | undefined;
}
export declare function getRouteParams(route: string, path: string): RouteParams | undefined;
export declare const instanceOfRoute: (middleware: any) => middleware is Route;
export declare class ApiRouter {
    private options?;
    private _routes;
    private _middlewares;
    constructor(options?: RouterOptions | undefined);
    use(handler: HandlerFunction): ApiRouter;
    get(path: string, handler: HandlerFunction): ApiRouter;
    post(path: string, handler: HandlerFunction): ApiRouter;
    put(path: string, handler: HandlerFunction): ApiRouter;
    patch(path: string, handler: HandlerFunction): ApiRouter;
    delete(path: string, handler: HandlerFunction): ApiRouter;
    routes(): Route[];
    middlewares(): HandlerFunction[];
    private createRoute;
    private addRoute;
}
