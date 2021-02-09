import { Logger, LogHandlerFunction } from "./logger";
import { Response } from "./response";
import { HandlerFunction, Route } from "./router";
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
    private middlewares;
    private middlewareFinally?;
    readonly log: Logger;
    constructor(options?: ApiOptions);
    use(middlewares: Route[] | HandlerFunction[]): Api;
    finally(handler: HandlerFunction): void;
    listen(event: any, context: any): Promise<Response>;
    private trace;
    private executeMiddlewares;
    private matchRoute;
    private handleErrors;
}
