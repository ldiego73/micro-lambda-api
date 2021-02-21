import { HandlerFunction } from "./options";
export interface Action {
    name: string;
    handler: HandlerFunction;
}
export declare const defaultActions: {
    CONNECT: string;
    DISCONNECT: string;
    DEFAULT: string;
};
export declare const isDefaultAction: (name: string) => boolean;
export declare const instanceOfAction: (middleware: any) => middleware is Action;
export declare class ApiSocket {
    private _actions;
    private _middlewares;
    use(handler: HandlerFunction): ApiSocket;
    connect(handler: HandlerFunction): ApiSocket;
    disconnect(handler: HandlerFunction): ApiSocket;
    action(name: string, handler: HandlerFunction): ApiSocket;
    actions(): Action[];
    middlewares(): HandlerFunction[];
    private addAction;
}
