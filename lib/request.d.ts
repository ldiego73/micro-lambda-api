export interface Request {
    id: string;
    method: string;
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
    stage: string;
    proxyIntegration: string;
    isBase64Encoded: boolean;
    [key: string]: any;
}
export declare function ApiRequest(event: any, context: any): Request;
