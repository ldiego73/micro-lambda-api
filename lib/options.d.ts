export interface RouterOptions {
    name: string;
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
