import { ApiRequest } from "./request";
import { ApiResponse } from "./response";
export interface RouterOptions {
    basePath?: string;
    version?: string;
}
export interface CorsOptions {
    credentials?: boolean;
    exposeHeaders?: string;
    headers?: string;
    maxAge?: number;
    methods?: string;
    origin?: string;
}
export declare type HandlerFunction = (request: ApiRequest, response: ApiResponse) => void | any | Promise<any>;
