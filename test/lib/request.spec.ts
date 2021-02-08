import * as rawHttp from "../data/data.http";
import * as rawRest from "../data/data.rest";
import * as rawAlb from "../data/data.alb";
import { ApiRequest, HttpIntegration, HttpMethod } from "../../lib";
import { deepCopy } from "../utils";

describe("Router", () => {
  let request: ApiRequest;
  let dataHttp: any;
  let dataRest: any;
  let dataAlb: any;

  beforeEach(() => {
    dataHttp = deepCopy(rawHttp);
    dataRest = deepCopy(rawRest);
    dataAlb = deepCopy(rawAlb);

    dataHttp.event.requestContext.stage = "";
    dataRest.event.requestContext.stage = "";
  });

  it("should be an Request in Http", () => {
    request = new ApiRequest(dataHttp.event, dataHttp.context);

    expect(request.id).toBe(dataHttp.context.awsRequestId);
    expect(request.stage).toBe(dataHttp.event.requestContext.stage);
    expect(request.method).toBe(dataHttp.event.requestContext.http.method);
    expect(request.path).toBe(dataHttp.event.rawPath);
    expect(request.query).toMatchObject(dataHttp.event.queryStringParameters);
    expect(request.params).toMatchObject({});
    expect(request.body).toBeInstanceOf(Object);
    expect(request.host).toBe(dataHttp.event.requestContext.domainName);
    expect(request.ip).toBe(dataHttp.event.headers["x-forwarded-for"]);
    expect(request.userAgent).toBe(dataHttp.event.headers["user-agent"]);
    expect(request.proxyIntegration).toBe(HttpIntegration.APIGW_HTTP_API);
    expect(request.isBase64Encoded).toBe(dataHttp.event.isBase64Encoded);
  });

  it("should be an Request in Rest", () => {
    request = new ApiRequest(dataRest.event, dataRest.context);

    expect(request.id).toBe(dataRest.context.awsRequestId);
    expect(request.stage).toBe(dataRest.event.requestContext.stage);
    expect(request.method).toBe(dataRest.event.httpMethod);
    expect(request.path).toBe(dataRest.event.path);
    expect(request.query).toMatchObject(dataRest.event.queryStringParameters);
    expect(request.params).toMatchObject({});
    expect(request.body).toBeInstanceOf(Object);
    expect(request.host).toBe(dataRest.event.requestContext.domainName);
    expect(request.ip).toBe(dataRest.event.headers["x-forwarded-for"]);
    expect(request.userAgent).toBe(dataRest.event.headers["user-agent"]);
    expect(request.proxyIntegration).toBe(HttpIntegration.APIGW_REST_API);
    expect(request.isBase64Encoded).toBe(dataRest.event.isBase64Encoded);
  });

  it("should be an Request with empty path", () => {
    dataRest.event.path = "";
    dataRest.context.awsRequestId = "";

    request = new ApiRequest(dataRest.event, dataRest.context);

    expect(request.path).toBe("");
  });

  it("should be an Request with request id empty", () => {
    dataRest.context.awsRequestId = "";

    request = new ApiRequest(dataRest.event, dataRest.context);

    expect(request.id).toBe(dataRest.event.requestContext.requestId);
  });

  it("should be an Request with stage default", () => {
    dataRest.event.requestContext.stage = "$default";

    request = new ApiRequest(dataRest.event, dataRest.context);

    expect(request.stage).toBe("");
  });

  it("should be an Request with body in base64", () => {
    dataRest.event.isBase64Encoded = true;
    dataRest.event.body =
      "eyJ1c2VybmFtZSI6ImxkaWVnbzczIiwicGFzc3dvcmQiOiJsZGllZ283MyIsImFnZSI6MzEsInN0YXR1cyI6IGZhbHNlfQ==";

    request = new ApiRequest(dataRest.event, dataRest.context);

    expect(request.body).toBeInstanceOf(Object);
  });

  it("should be an Request with body empty in base64", () => {
    dataRest.event.isBase64Encoded = true;
    dataRest.event.body = "";

    request = new ApiRequest(dataRest.event, dataRest.context);

    expect(request.body).toBe("");
  });

  it("should be an Request with host empty", () => {
    dataRest.event.headers.host = "";

    request = new ApiRequest(dataRest.event, dataRest.context);

    expect(request.host).toBe(dataRest.event.requestContext.domainName);
  });

  it("should be an Request with RequestContext null", () => {
    dataAlb.event.requestContext = null;
    dataAlb.event.httpMethod = "";

    delete dataAlb.event.headers["x-forwarded-for"];
    delete dataAlb.event.headers["user-agent"];

    request = new ApiRequest(dataAlb.event, dataAlb.context);

    expect(request.id).toBe(dataAlb.context.awsRequestId);
    expect(request.stage).toBe("");
    expect(request.method).toBe(HttpMethod.GET);
    expect(request.path).toBe(dataAlb.event.path);
    expect(request.query).toMatchObject(dataAlb.event.queryStringParameters);
    expect(request.params).toMatchObject({});
    expect(request.body).toBeInstanceOf(Object);
    expect(request.host).toBe(dataAlb.event.headers["host"]);
    expect(request.ip).toBe("");
    expect(request.userAgent).toBe("");
    expect(request.proxyIntegration).toBe(HttpIntegration.APIGW_REST_API);
    expect(request.isBase64Encoded).toBe(dataAlb.event.isBase64Encoded);
  });

  it("should be an Request with RequestContext only with http", () => {
    const sourceIp = "10.10.10.10";
    const userAgent = "Google";

    delete dataAlb.event.headers["x-forwarded-for"];
    delete dataAlb.event.headers["user-agent"];

    dataAlb.event.requestContext = {
      http: { sourceIp, userAgent }
    };

    request = new ApiRequest(dataAlb.event, dataAlb.context);

    expect(request.ip).toBe(sourceIp);
    expect(request.userAgent).toBe(userAgent);
  });

  it("should be an Request with RequestContext only with identity", () => {
    const sourceIp = "10.10.10.10";
    const userAgent = "Google";

    delete dataAlb.event.headers["x-forwarded-for"];
    delete dataAlb.event.headers["user-agent"];

    dataAlb.event.headers = null;
    dataAlb.event.requestContext = {
      identity: { sourceIp, userAgent }
    };

    request = new ApiRequest(dataAlb.event, dataAlb.context);

    expect(request.ip).toBe(sourceIp);
    expect(request.userAgent).toBe(userAgent);
  });
});
