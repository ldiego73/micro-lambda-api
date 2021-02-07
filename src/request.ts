import qs from "querystring";
import { HttpIntegration } from "./http";
import { normalizePath, parseBody } from "./utils";
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function ApiRequest(event: any, context: any): Request {
  const { requestContext, isBase64Encoded } = event;

  const id = context.awsRequestId || requestContext.requestId;
  const rawStage = requestContext?.stage || "";
  const stage = rawStage === "$default" ? "" : rawStage;
  const method =
    event.httpMethod ||
    requestContext?.http?.method ||
    requestContext?.httpMethod ||
    undefined;

  let path = event.path || event.rawPath || "/";
  const routeKey = requestContext.resourcePath || requestContext.routeKey;
  if (
    rawStage &&
    routeKey &&
    path.indexOf(`/${rawStage}/`) === 0 &&
    routeKey.indexOf(`/${rawStage}/`) !== 0
  ) {
    path = path.substring(rawStage.length + 1);
  }

  path = normalizePath(path);

  const query = Object.assign({}, event.queryStringParameters);
  const headers: { [key: string]: any } = {};

  if (event.headers) {
    for (const header in event.headers) {
      headers[header.toLowerCase()] = event.headers[header];
    }
    headers["x-request-id"] = id;
  }

  const rawBody = isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString()
    : event.body;
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

  const host = headers.host || requestContext.domainName;

  const rawIp =
    headers["x-forwarded-for"] ||
    requestContext?.http?.sourceIp ||
    requestContext.identity.sourceIp ||
    "";
  const ip = rawIp.split(",")[0].trim();

  const userAgent =
    headers["user-agent"] ||
    requestContext?.http?.userAgent ||
    requestContext?.identity?.userAgent ||
    "";
  const proxyIntegration = requestContext.elb
    ? HttpIntegration.ALB
    : event["version"] === "2.0"
    ? HttpIntegration.APIGW_HTTP_API
    : HttpIntegration.APIGW_REST_API;

  return {
    id,
    method,
    path,
    query,
    headers,
    body,
    host,
    ip,
    userAgent,
    stage,
    proxyIntegration,
    isBase64Encoded,
  };
}
