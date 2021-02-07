"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRequest = void 0;
const querystring_1 = __importDefault(require("querystring"));
const http_1 = require("./http");
const utils_1 = require("./utils");
function ApiRequest(event, context) {
    var _a, _b, _c, _d;
    const { requestContext, isBase64Encoded } = event;
    const id = context.awsRequestId || requestContext.requestId;
    const rawStage = (requestContext === null || requestContext === void 0 ? void 0 : requestContext.stage) || "";
    const stage = rawStage === "$default" ? "" : rawStage;
    const method = event.httpMethod || ((_a = requestContext === null || requestContext === void 0 ? void 0 : requestContext.http) === null || _a === void 0 ? void 0 : _a.method) || (requestContext === null || requestContext === void 0 ? void 0 : requestContext.httpMethod) ||
        undefined;
    let path = event.path || event.rawPath || "/";
    const routeKey = requestContext.resourcePath || requestContext.routeKey;
    if (rawStage &&
        routeKey &&
        path.indexOf(`/${rawStage}/`) === 0 &&
        routeKey.indexOf(`/${rawStage}/`) !== 0) {
        path = path.substring(rawStage.length + 1);
    }
    path = utils_1.normalizePath(path);
    const query = Object.assign({}, event.queryStringParameters);
    const headers = {};
    if (event.headers) {
        for (const header in event.headers) {
            headers[header.toLowerCase()] = event.headers[header];
        }
        headers["x-request-id"] = id;
    }
    const rawBody = isBase64Encoded
        ? Buffer.from(event.body || "", "base64").toString()
        : event.body;
    let body;
    if (headers["content-type"] &&
        headers["content-type"].includes("application/x-www-form-urlencoded")) {
        body = querystring_1.default.parse(rawBody);
    }
    else if (typeof rawBody === "object") {
        body = rawBody;
    }
    else {
        body = utils_1.parseBody(rawBody);
    }
    const host = headers.host || requestContext.domainName;
    const rawIp = headers["x-forwarded-for"] || ((_b = requestContext === null || requestContext === void 0 ? void 0 : requestContext.http) === null || _b === void 0 ? void 0 : _b.sourceIp) ||
        requestContext.identity.sourceIp ||
        "";
    const ip = rawIp.split(",")[0].trim();
    const userAgent = headers["user-agent"] || ((_c = requestContext === null || requestContext === void 0 ? void 0 : requestContext.http) === null || _c === void 0 ? void 0 : _c.userAgent) || ((_d = requestContext === null || requestContext === void 0 ? void 0 : requestContext.identity) === null || _d === void 0 ? void 0 : _d.userAgent) ||
        "";
    const proxyIntegration = requestContext.elb
        ? http_1.HttpIntegration.ALB
        : event["version"] === "2.0"
            ? http_1.HttpIntegration.APIGW_HTTP_API
            : http_1.HttpIntegration.APIGW_REST_API;
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
exports.ApiRequest = ApiRequest;
