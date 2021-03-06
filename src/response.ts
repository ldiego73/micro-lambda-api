/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ApiError } from "./errors";
import {
  HttpStatus,
  HttpIntegration,
  HttpHeadersCors,
  HttpContentTypes,
} from "./http";
import { CorsOptions } from "./options";
import { ApiRequest } from "./request";

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

export class ApiResponse {
  static cors = false;
  static credentials = false;

  private statusCode = HttpStatus.OK;
  headers: {
    [key: string]: string | undefined;
  } = {
    "content-type": "application/json",
  };
  private _response: any;
  private _error: any;

  constructor(private request?: ApiRequest) {
    if (request && request.headers["x-request-id"]) {
      this.headers["x-request-id"] = request.headers["x-request-id"];
    }
  }

  status(code: HttpStatus): ApiResponse {
    this.statusCode = code;
    return this;
  }

  header(key: string, value: string): ApiResponse {
    this.headers[key.toLowerCase()] = value;
    return this;
  }

  private setDefaultCors(acao?: string, acam?: string, acah?: string): void {
    this.headers["Access-Control-Allow-Origin"] =
      acao || HttpHeadersCors.ORIGIN;
    this.headers["Access-Control-Allow-Methods"] =
      acam || HttpHeadersCors.METHODS;
    this.headers["Access-Control-Allow-Headers"] =
      acah || HttpHeadersCors.HEADERS;
  }

  private getDefaultCors(): [
    string | undefined,
    string | undefined,
    string | undefined
  ] {
    return [
      this.headers["Access-Control-Allow-Origin"],
      this.headers["Access-Control-Allow-Methods"],
      this.headers["Access-Control-Allow-Headers"],
    ];
  }

  cors(options?: CorsOptions): ApiResponse {
    const opts = options || {};

    const [acao, acam, acah] = this.getDefaultCors();
    this.setDefaultCors(
      opts.origin || acao,
      opts.methods || acam,
      opts.headers || acah
    );

    if (opts.credentials) {
      this.headers["Access-Control-Allow-Credentials"] = "true";
    }

    if (opts.exposeHeaders) {
      this.headers["Access-Control-Expose-Headers"] = opts.exposeHeaders;
    }

    if (opts.maxAge && !isNaN(opts.maxAge)) {
      this.headers["Access-Control-Max-Age"] = (
        (opts.maxAge / 1000) |
        0
      ).toString();
    }

    return this;
  }

  toResponse(): Response {
    return this._response;
  }

  toResponseError(): ResponseError {
    return this._error;
  }

  send(payload?: unknown, isError = false): Response {
    let responseBody = "";

    if (typeof payload !== "undefined") {
      responseBody =
        typeof payload !== "string" ? JSON.stringify(payload) : payload;
    }

    if (ApiResponse.cors) {
      const [acao, acam, acah] = this.getDefaultCors();
      this.setDefaultCors(acao, acam, acah);
    }

    if (ApiResponse.credentials) {
      this.headers["Access-Control-Allow-Credentials"] = "true";
    }

    const response: Response = {
      isBase64Encoded: isError ? false : this.request?.isBase64Encoded || false,
      statusCode: this.statusCode,
      body: responseBody,
      headers: this.headers,
    };

    if (this.request?.proxyIntegration === HttpIntegration.ALB) {
      response.statusDescription = `${this.statusCode} ${
        HttpStatus[this.statusCode]
      }`;
    }

    this._response = response;

    return response;
  }

  json(body: any): Response {
    return this.header("content-type", HttpContentTypes.JSON).send(body);
  }

  html(body: string): Response {
    return this.header("content-type", HttpContentTypes.HTML).send(body);
  }

  file(body: any): Response {
    return this.header("content-type", HttpContentTypes.BINARY).send(body);
  }

  error(data: ResponseError | string): Response {
    if (typeof data === "string") {
      this._error = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: ApiError.GENERIC_ERROR,
        message: data,
      } as ResponseError;
    } else {
      this._error = {
        status: data.status,
        code: data.code,
        message: data.message,
        ...(data.data ?? {}),
      } as ResponseError;
    }

    return this.send(this._error, true);
  }
}
