import { Logger, LogHandlerFunction } from "./logger";
import { HandlerFunction } from "./options";
import { Response } from "./response";
import { Route } from "./router";
import { Action } from "./socket";
export interface ApiOptions {
    logger?: ApiOptionsLogger;
}
export interface ApiOptionsLogger {
    trace?: boolean;
    pretty?: boolean;
    handler?: LogHandlerFunction;
}
export declare class Api {
    private options;
    private routes;
    private actions;
    private middlewares;
    private middlewareFinally?;
    readonly log: Logger;
    constructor(options?: ApiOptions);
    use(middlewares: Route[] | Action[] | HandlerFunction[]): Api;
    finally(handler: HandlerFunction): void;
    listen(event: any, context: any): Promise<Response>;
    private trace;
    private findRoute;
    private findAction;
    private executeMiddlewares;
    private matchRoute;
    private handleErrors;
}
