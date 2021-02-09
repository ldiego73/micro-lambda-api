declare type LogData = {
    [key: string]: any;
};
export declare type LogHandlerFunction = (log: Log) => void | any | Promise<any>;
export declare enum LoggerLevel {
    Fatal = "fatal",
    Error = "error",
    Warn = "warn",
    Info = "info",
    Debug = "debug",
    Trace = "trace"
}
export interface LoggerOptions {
    context?: any;
    pretty?: boolean;
    handler?: LogHandlerFunction;
}
export interface Log {
    id: string;
    level: string;
    group?: string;
    message: string;
    data?: unknown;
    time: number;
    timeStamp: string;
    lambda?: LogLambda;
    [key: string]: any;
}
export interface LogLambda {
    name: string;
    version: string;
    memoryLimitInMB: number;
    arn: string;
}
export declare class Logger {
    private static options;
    private static id;
    private static lambda;
    private _group;
    private _log;
    private _extras;
    static configure(options?: LoggerOptions): void;
    static create(): Logger;
    private constructor();
    group(name: string): Logger;
    addExtra(key: string, value: unknown): void;
    getExtra(key: string): unknown;
    removeExtra(key: string): void;
    clearExtras(): void;
    fatal(message: string, data?: LogData): void;
    error(message: string, data?: LogData): void;
    warn(message: string, data?: LogData): void;
    info(message: string, data?: LogData): void;
    debug(message: string, data?: LogData): void;
    trace(message: string, data?: LogData): void;
    toLog(): Log;
    private log;
    private out;
    private err;
    private toPrettyLog;
    private toJsonLog;
}
export {};
