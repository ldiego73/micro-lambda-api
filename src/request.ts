import qs from "querystring";
import { HttpIntegration } from "./http";
import { normalizePath, parseBody } from "./utils";
export class ApiRequest {
  private _id: string;
  private _stage: string;
  private _method: string;
  private _path: string;
  private _query: {
    [key: string]: string | undefined;
  } = {};
  private _params: {
    [key: string]: string | undefined;
  } = {};
  private _headers: {
    [key: string]: string | undefined;
  } = {};
  private _body: any;
  private _host: string;
  private _ip: string;
  private _userAgent: string;
  private _proxyIntegration: HttpIntegration;
  private _isBase64Encoded: boolean;

  [key: string]: any;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(event: any, context: any) {
    const { requestContext, isBase64Encoded } = event;

    const rawStage = requestContext?.stage || "";
    const routeKey = requestContext.resourcePath || requestContext.routeKey;

    let path = event.path || event.rawPath || "/";

    if (
      rawStage &&
      routeKey &&
      path.indexOf(`/${rawStage}/`) === 0 &&
      routeKey.indexOf(`/${rawStage}/`) !== 0
    ) {
      path = path.substring(rawStage.length + 1);
    }

    path = normalizePath(path);

    this._id = context.awsRequestId || requestContext.requestId;
    this._stage = rawStage === "$default" ? "" : rawStage;
    this._method =
      event.httpMethod ||
      requestContext?.http?.method ||
      requestContext?.httpMethod ||
      undefined;
    this._path = path;
    this._query = Object.assign({}, event.queryStringParameters);

    if (event.headers) {
      for (const header in event.headers) {
        this._headers[header.toLowerCase()] = event.headers[header];
      }
      this._headers["x-request-id"] = this._id;
    }

    const rawBody = isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString()
      : event.body;

    if (
      this._headers["content-type"] &&
      this._headers["content-type"].includes(
        "application/x-www-form-urlencoded"
      )
    ) {
      this._body = qs.parse(rawBody);
    } else if (typeof rawBody === "object") {
      this._body = rawBody;
    } else {
      this._body = parseBody(rawBody);
    }

    this._host = this._headers.host || requestContext.domainName;

    const rawIp =
      this._headers["x-forwarded-for"] ||
      requestContext?.http?.sourceIp ||
      requestContext.identity.sourceIp ||
      "";

    this._ip = rawIp.split(",")[0].trim();
    this._userAgent =
      this._headers["user-agent"] ||
      requestContext?.http?.userAgent ||
      requestContext?.identity?.userAgent ||
      "";
    this._proxyIntegration = requestContext.elb
      ? HttpIntegration.ALB
      : event["version"] === "2.0"
      ? HttpIntegration.APIGW_HTTP_API
      : HttpIntegration.APIGW_REST_API;
    this._isBase64Encoded = isBase64Encoded;
  }

  get id(): string {
    return this._id;
  }

  get stage(): string {
    return this._stage;
  }

  get method(): string {
    return this._method;
  }

  get path(): string {
    return this._path;
  }

  get query(): { [key: string]: string | undefined } {
    return this._query;
  }

  get params(): { [key: string]: string | undefined } {
    return this._params;
  }

  set params(value: { [key: string]: string | undefined }) {
    this._params = value;
  }

  get headers(): { [key: string]: string | undefined } {
    return this._headers;
  }

  get body(): any {
    return this._body;
  }

  get host(): string {
    return this._host;
  }

  get ip(): string {
    return this._ip;
  }

  get userAgent(): string {
    return this._userAgent;
  }

  get proxyIntegration(): HttpIntegration {
    return this._proxyIntegration;
  }

  get isBase64Encoded(): boolean {
    return this._isBase64Encoded;
  }
}
