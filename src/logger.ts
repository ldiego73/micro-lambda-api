/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { uuidv4 } from "./uuid";

const { stdout, stderr } = process;

type LogData = { [key: string]: any };

export type LogHandlerFunction = (log: Log) => void | any | Promise<any>;

export enum LoggerLevel {
  Fatal = "fatal",
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
}

export interface LoggerOptions {
  context?: any;
  pretty?: boolean;
  handler?: LogHandlerFunction;
}

const LogKeys = [
  "id",
  "level",
  "name",
  "group",
  "message",
  "data",
  "time",
  "timeStamp",
  "lambda",
];

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

export class Logger {
  private static options: LoggerOptions = {};
  private static id = "";
  private static lambda: LogLambda;

  private _group = "";
  private _log: any = {};
  private _extras: LogData = {};

  static configure(options: LoggerOptions = {}): void {
    Logger.options.pretty = options.pretty || false;

    /* istanbul ignore else */
    if (typeof options.context !== "undefined" && options.context) {
      const { context } = options;

      Logger.id = context.awsRequestId || uuidv4();

      if (context.functionName) {
        Logger.lambda = {
          name: context.functionName,
          version: context.functionVersion,
          memoryLimitInMB: context.memoryLimitInMB,
          arn: context.invokedFunctionArn,
        };
      }
    }

    /* istanbul ignore else */
    if (typeof options.handler === "function")
      Logger.options.handler = options.handler;
  }

  static create(): Logger {
    return new Logger();
  }

  private constructor() {
    Logger.id = Logger.id || uuidv4();
    this._extras = {};
  }

  group(name: string): Logger {
    this._group = name;

    return this;
  }

  addExtra(key: string, value: unknown): void {
    if (LogKeys.indexOf(key) > -1)
      throw Error(`The Key "${key}" cannot be used`);
    this._extras[key] = value;
  }

  getExtra(key: string): unknown {
    return this._extras[key];
  }

  removeExtra(key: string): void {
    delete this._extras[key];
  }

  clearExtras(): void {
    this._extras = {};
  }

  fatal(message: string, data?: LogData): void {
    this.log(LoggerLevel.Fatal, message, data);
  }
  error(message: string, data?: LogData): void {
    this.log(LoggerLevel.Error, message, data);
  }
  warn(message: string, data?: LogData): void {
    this.log(LoggerLevel.Warn, message, data);
  }
  info(message: string, data?: LogData): void {
    this.log(LoggerLevel.Info, message, data);
  }
  debug(message: string, data?: LogData): void {
    this.log(LoggerLevel.Debug, message, data);
  }
  trace(message: string, data?: LogData): void {
    this.log(LoggerLevel.Trace, message, data);
  }

  toLog(): Log {
    return this._log;
  }

  private log(level: LoggerLevel, message: string, data?: LogData): void {
    const t = new Date();
    let result: Log = {
      id: Logger.id,
      level,
      time: t.getTime(),
      timeStamp: t.toISOString(),
      message,
    };

    if (this._group) result.group = this._group;
    if (typeof data === "object") result.data = { ...data };
    if (typeof Logger.lambda === "object") result.lambda = Logger.lambda;
    if (this._extras && Object.keys(this._extras).length > 0)
      result = Object.assign(result, { ...this._extras });

    this._log = result;

    if (typeof Logger.options.handler === "function") {
      Logger.options.handler(result);
    }

    if (level === LoggerLevel.Fatal || level === LoggerLevel.Error)
      this.out(result);
    else this.err(result);
  }

  private out(log: Log): void {
    if (Logger.options.pretty) {
      stdout.write(this.toPrettyLog(log));
    } else {
      stdout.write(this.toJsonLog(log));
    }
  }

  private err(log: Log): void {
    if (Logger.options.pretty) {
      stderr.write(this.toPrettyLog(log));
    } else {
      stderr.write(this.toJsonLog(log));
    }
  }

  private toPrettyLog(log: Log): string {
    return `[${log.timeStamp}] [${log.level.toUpperCase()}] - ${
      log.message
    } => ${JSON.stringify(log)}\n`;
  }

  private toJsonLog(log: Log): string {
    return `${JSON.stringify(log)}\n`;
  }
}
