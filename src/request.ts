import qs from "querystring";
import { HttpIntegration, HttpMethod } from "./http";
import { Logger } from "./logger";
import { normalizePath, parseBody } from "./utils";
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
  // Available for WebSocket
  connectionId?: string;
}

export class ApiRequest {
  private _request: Request;

  readonly log = Logger.create();

  [key: string]: any;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(event: any, context: any) {
    const requestContext = event.requestContext || {};
    const { isBase64Encoded } = event;

    const rawStage = requestContext.stage || "";
    const route = requestContext.resourcePath || requestContext.routeKey;

    let path = event.path || event.rawPath || "/";

    if (
      rawStage &&
      route &&
      path.indexOf(`/${rawStage}/`) === 0 &&
      route.indexOf(`/${rawStage}/`) !== 0
    ) {
      path = path.substring(rawStage.length + 1);
    }

    path = normalizePath(path);

    const id = context.awsRequestId || requestContext.requestId;
    const stage = rawStage === "$default" ? "" : rawStage;
    const method =
      event.httpMethod ||
      requestContext.http?.method ||
      requestContext.httpMethod ||
      HttpMethod.GET;
    const query = Object.assign({}, event.queryStringParameters);
    const headers: any = {};

    if (event.headers) {
      for (const header in event.headers) {
        headers[header.toLowerCase()] = event.headers[header];
      }
      headers["x-request-id"] = id;
    }

    const rawBody = isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString()
      : event.body || "";
    let body: any;

    if (
      headers["content-type"] &&
      headers["content-type"].includes("application/x-www-form-urlencoded")
    ) {
      body = qs.parse(rawBody);
    } else if (typeof rawBody === "object") {
      body = rawBody;
    } else {
      body = parseBody(rawBody);
    }

    const connectionId = requestContext.connectionId || "";
    const host = headers.host || requestContext.domainName;
    const rawIp =
      headers["x-forwarded-for"] ||
      requestContext.http?.sourceIp ||
      requestContext.identity?.sourceIp ||
      "";
    const ip = rawIp.split(",")[0].trim();
    const userAgent =
      headers["user-agent"] ||
      requestContext.http?.userAgent ||
      requestContext.identity?.userAgent ||
      "";

    let proxyIntegration: HttpIntegration;

    if (requestContext.elb) proxyIntegration = HttpIntegration.ALB;
    else if (event["version"] === "2.0")
      proxyIntegration = HttpIntegration.APIGW_HTTP_API;
    else if (requestContext.eventType)
      proxyIntegration = HttpIntegration.APIGW_WS_API;
    else proxyIntegration = HttpIntegration.APIGW_REST_API;

    this._request = {
      id,
      stage,
      method,
      route,
      path,
      query,
      headers,
      body,
      host,
      ip,
      userAgent,
      proxyIntegration,
      isBase64Encoded,
    };

    // Available for WebSocket
    /* istanbul ignore else */
    if (connectionId) this._request.connectionId = connectionId;
  }

  get id(): string {
    return this._request.id;
  }

  get stage(): string {
    return this._request.stage;
  }

  get method(): string {
    return this._request.method;
  }

  get path(): string {
    return this._request.path;
  }

  get query(): { [key: string]: string | undefined } {
    return this._request.query;
  }

  get params(): { [key: string]: string | undefined } {
    return this._request.params || {};
  }

  set params(value: { [key: string]: string | undefined }) {
    this._request.params = value;
  }

  get headers(): { [key: string]: string | undefined } {
    return this._request.headers;
  }

  get body(): any {
    return this._request.body;
  }

  get host(): string {
    return this._request.host;
  }

  get ip(): string {
    return this._request.ip;
  }

  get userAgent(): string {
    return this._request.userAgent;
  }

  get proxyIntegration(): HttpIntegration {
    return this._request.proxyIntegration;
  }

  get isBase64Encoded(): boolean {
    return this._request.isBase64Encoded;
  }

  // Available for WebSocket
  get connectionId(): string | undefined {
    return this._request.connectionId;
  }

  get route(): string {
    return this._request.route;
  }

  toRequest(): Request {
    /* istanbul ignore next */
    return this._request || {};
  }
}
