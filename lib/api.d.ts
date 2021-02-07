import { Response } from "./response";
import { HandlerFunction, Route } from "./router";
export declare class Api {
    private routes;
    private middlewares;
    private middlewareFinally?;
    use(middlewares: Route[] | HandlerFunction[]): Api;
    finally(handler: HandlerFunction): void;
    listen(event: any, context: any): Promise<Response>;
    private executeMiddlewares;
    private matchRoute;
    private handleErrors;
}
