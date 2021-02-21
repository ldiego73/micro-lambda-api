import { HttpIntegration } from "./http";
import { Logger } from "./logger";
interface Request {
    id: string;
    stage: string;
    method: string;
    route: string;
    path: string;
    query: {
        [key: string]: string | undefined;
    };
    params?: {
        [key: string]: string | undefined;
    };
    headers: {
        [key: string]: string | undefined;
    };
    body: any;
    host: string;
    ip: string;
    userAgent: string;
    proxyIntegration: HttpIntegration;
    isBase64Encoded: boolean;
    connectionId?: string;
}
export declare class ApiRequest {
    private _request;
    readonly log: Logger;
    [key: string]: any;
    constructor(event: any, context: any);
    get id(): string;
    get stage(): string;
    get method(): string;
    get path(): string;
    get query(): {
        [key: string]: string | undefined;
    };
    get params(): {
        [key: string]: string | undefined;
    };
    set params(value: {
        [key: string]: string | undefined;
    });
    get headers(): {
        [key: string]: string | undefined;
    };
    get body(): any;
    get host(): string;
    get ip(): string;
    get userAgent(): string;
    get proxyIntegration(): HttpIntegration;
    get isBase64Encoded(): boolean;
    get connectionId(): string | undefined;
    get route(): string;
    toRequest(): Request;
}
export {};
