import { HttpIntegration } from "./http";
export declare class ApiRequest {
    private _id;
    private _stage;
    private _method;
    private _path;
    private _query;
    private _params;
    private _headers;
    private _body;
    private _host;
    private _ip;
    private _userAgent;
    private _proxyIntegration;
    private _isBase64Encoded;
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
}
