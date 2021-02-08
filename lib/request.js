"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRequest = void 0;
const querystring_1 = __importDefault(require("querystring"));
const http_1 = require("./http");
const utils_1 = require("./utils");
class ApiRequest {
    constructor(event, context) {
        var _a, _b, _c, _d, _e;
        this._query = {};
        this._params = {};
        this._headers = {};
        const requestContext = event.requestContext || {};
        const { isBase64Encoded } = event;
        const rawStage = requestContext.stage || "";
        const routeKey = requestContext.resourcePath || requestContext.routeKey;
        let path = event.path || event.rawPath || "/";
        if (rawStage &&
            routeKey &&
            path.indexOf(`/${rawStage}/`) === 0 &&
            routeKey.indexOf(`/${rawStage}/`) !== 0) {
            path = path.substring(rawStage.length + 1);
        }
        path = utils_1.normalizePath(path);
        this._id = context.awsRequestId || requestContext.requestId;
        this._stage = rawStage === "$default" ? "" : rawStage;
        this._method =
            event.httpMethod || ((_a = requestContext.http) === null || _a === void 0 ? void 0 : _a.method) ||
                requestContext.httpMethod ||
                http_1.HttpMethod.GET;
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
        if (this._headers["content-type"] &&
            this._headers["content-type"].includes("application/x-www-form-urlencoded")) {
            this._body = querystring_1.default.parse(rawBody);
        }
        else if (typeof rawBody === "object") {
            this._body = rawBody;
        }
        else {
            this._body = utils_1.parseBody(rawBody);
        }
        this._host = this._headers.host || requestContext.domainName;
        const rawIp = this._headers["x-forwarded-for"] || ((_b = requestContext.http) === null || _b === void 0 ? void 0 : _b.sourceIp) || ((_c = requestContext.identity) === null || _c === void 0 ? void 0 : _c.sourceIp) ||
            "";
        this._ip = rawIp.split(",")[0].trim();
        this._userAgent =
            this._headers["user-agent"] || ((_d = requestContext.http) === null || _d === void 0 ? void 0 : _d.userAgent) || ((_e = requestContext.identity) === null || _e === void 0 ? void 0 : _e.userAgent) ||
                "";
        this._proxyIntegration = requestContext.elb
            ? http_1.HttpIntegration.ALB
            : event["version"] === "2.0"
                ? http_1.HttpIntegration.APIGW_HTTP_API
                : http_1.HttpIntegration.APIGW_REST_API;
        this._isBase64Encoded = isBase64Encoded;
    }
    get id() {
        return this._id;
    }
    get stage() {
        return this._stage;
    }
    get method() {
        return this._method;
    }
    get path() {
        return this._path;
    }
    get query() {
        return this._query;
    }
    get params() {
        return this._params;
    }
    set params(value) {
        this._params = value;
    }
    get headers() {
        return this._headers;
    }
    get body() {
        return this._body;
    }
    get host() {
        return this._host;
    }
    get ip() {
        return this._ip;
    }
    get userAgent() {
        return this._userAgent;
    }
    get proxyIntegration() {
        return this._proxyIntegration;
    }
    get isBase64Encoded() {
        return this._isBase64Encoded;
    }
}
exports.ApiRequest = ApiRequest;
