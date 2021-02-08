"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const errors_1 = require("./errors");
const http_1 = require("./http");
class ApiResponse {
    constructor(request) {
        this.request = request;
        this.statusCode = http_1.HttpStatus.OK;
        this.headers = Object.assign({}, request === null || request === void 0 ? void 0 : request.headers);
    }
    status(code) {
        this.statusCode = code;
        return this;
    }
    header(key, value) {
        this.headers[key.toLowerCase()] = value;
        return this;
    }
    setDefaultCors(acao, acam, acah) {
        this.headers["Access-Control-Allow-Origin"] =
            acao || http_1.HttpHeadersCors.ORIGIN;
        this.headers["Access-Control-Allow-Methods"] =
            acam || http_1.HttpHeadersCors.METHODS;
        this.headers["Access-Control-Allow-Headers"] =
            acah || http_1.HttpHeadersCors.HEADERS;
    }
    getDefaultCors() {
        return [
            this.headers["Access-Control-Allow-Origin"],
            this.headers["Access-Control-Allow-Methods"],
            this.headers["Access-Control-Allow-Headers"],
        ];
    }
    cors(options) {
        const opts = options || {};
        const [acao, acam, acah] = this.getDefaultCors();
        this.setDefaultCors(opts.origin || acao, opts.methods || acam, opts.headers || acah);
        if (opts.credentials) {
            this.headers["Access-Control-Allow-Credentials"] = "true";
        }
        if (opts.exposeHeaders) {
            this.headers["Access-Control-Expose-Headers"] = opts.exposeHeaders;
        }
        if (opts.maxAge && !isNaN(opts.maxAge)) {
            this.headers["Access-Control-Max-Age"] = ((opts.maxAge / 1000) |
                0).toString();
        }
        return this;
    }
    getResponse() {
        return this.response;
    }
    send(payload, isError = false) {
        var _a, _b;
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
        const response = {
            isBase64Encoded: isError ? false : ((_a = this.request) === null || _a === void 0 ? void 0 : _a.isBase64Encoded) || false,
            statusCode: this.statusCode,
            body: responseBody,
            headers: this.headers,
        };
        if (((_b = this.request) === null || _b === void 0 ? void 0 : _b.proxyIntegration) === http_1.HttpIntegration.ALB) {
            response.statusDescription = `${this.statusCode} ${http_1.HttpStatus[this.statusCode]}`;
        }
        this.response = response;
        return response;
    }
    json(body) {
        return this.header("content-type", http_1.HttpContentTypes.JSON).send(body);
    }
    html(body) {
        return this.header("content-type", http_1.HttpContentTypes.HTML).send(body);
    }
    file(body) {
        return this.header("content-type", http_1.HttpContentTypes.BINARY).send(body);
    }
    error(data) {
        var _a;
        if (typeof data === "string") {
            return this.send({
                code: errors_1.ApiError.GENERIC_ERROR,
                message: data,
                status: http_1.HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
        return this.send({
            status: data.status,
            code: data.code,
            message: data.message,
            ...((_a = data.data) !== null && _a !== void 0 ? _a : {}),
        }, true);
    }
}
exports.ApiResponse = ApiResponse;
ApiResponse.cors = false;
ApiResponse.credentials = false;
