import { HttpStatus } from "./http";
import { CorsOptions } from "./options";
import { Request } from "./request";
export interface Response {
    isBase64Encoded: boolean;
    statusCode: number;
    statusDescription?: string;
    body: string;
    headers: {
        [key: string]: string | undefined;
    };
}
export interface ResponseError {
    status?: HttpStatus;
    code: string;
    message: string;
    data?: {
        [key: string]: unknown;
    };
}
export declare class ApiResponse {
    private request?;
    static cors: boolean;
    static credentials: boolean;
    private statusCode;
    private headers;
    constructor(request?: Request | undefined);
    status(code: HttpStatus): ApiResponse;
    header(key: string, value: string): ApiResponse;
    private setDefaultCors;
    private getDefaultCors;
    cors(options?: CorsOptions): ApiResponse;
    send(payload?: unknown, isError?: boolean): Response;
    json(body: any): Response;
    html(body: string): Response;
    file(body: any): Response;
    error(payload: ResponseError): Response;
}
