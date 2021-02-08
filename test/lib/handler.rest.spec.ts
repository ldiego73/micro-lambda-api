/* eslint-disable security-node/detect-crlf */
/* eslint-disable no-console */

import { context, event } from "../data/data.rest";
import {
  Api,
  ApiRequest,
  ApiResponse,
  ApiRouter,
  HttpIntegration,
  HttpMethod,
  HttpStatus,
} from "../../lib";
import { performance } from "perf_hooks";
import { deepCopy } from "../utils";

describe("Handler with AWS API Gateway REST API", () => {
  const api = new Api();
  const router = new ApiRouter();

  beforeAll(() => {
    ApiResponse.cors = true;
    ApiResponse.credentials = true;

    router
      .use((req) => {
        req.start = performance.now();
      })
      .get("/users", (req) => {
        return req.body;
      })
      .post("/users", (_, res) => {
        res.status(HttpStatus.CREATED);

        return { userId: Math.random() };
      })
      .get("/users/export", (_, res) => {
        res.html("<h1>Average 100</h1>>");
      })
      .get("/users/:id", (req, res) => {
        res.json(req.body);
      })
      .put("/users/:id", (_, res) => {
        res.status(HttpStatus.CREATED).send();
      })
      .delete("/users/:id", (req, res) => {
        res
          .status(HttpStatus.NO_CONTENT)
          .cors({ exposeHeaders: "", maxAge: 1000 })
          .send(true);
      });

    api
      .use(router.routes())
      .use(router.middlewares())
      .finally((req) => {
        req.end = performance.now();
      });
  });

  it("should be the event an HTTP API", () => {
    expect(event.version).toBe("1.0");
    expect(typeof event.requestContext === "object").toBeTruthy();
  });

  it("should be a valid request", () => {
    const _event = deepCopy(event);
    const request = new ApiRequest(_event, context);

    expect(request.id).toBe(context.awsRequestId);
    expect(request.method).toBe(event.requestContext.httpMethod);
    expect(`/${request.stage}${request.path}`).toBe(event.requestContext.path);
    expect(request.headers).toMatchObject(event.headers);
    expect(typeof request.body).toBe("object");
    expect(request.host).toBe(event.headers.host);
    expect(event.requestContext.identity.sourceIp).toContain(request.ip);
    expect(request.userAgent).toBe(event.headers["user-agent"]);
    expect(request.stage).toBe(event.requestContext.stage);
    expect(request.proxyIntegration).toBe(HttpIntegration.APIGW_REST_API);
    expect(request.isBase64Encoded).toBe(event.isBase64Encoded);
  });

  it("should run the route of GET /users", async () => {
    const _event = deepCopy(event);

    _event.path = "/develop/users";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should run the route of POST /users", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.POST;
    _event.path = "/develop/users";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.CREATED);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should run the route of GET /users/export", async () => {
    const _event = deepCopy(event);

    _event.path = "/develop/users/export";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should run the route of GET /users/:id", async () => {
    const _event = deepCopy(event);
    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should run the route of DELETE /users/:id", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.DELETE;
    _event.path = "/develop/users/300/////";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should be validate that the route does not exist", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.GET;
    _event.path = "/develop/users/100/profile";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should be validate that the method not allowed", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.PATCH;
    _event.path = "/develop/users/100/profile";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.METHOD_NOT_ALLOWED);
    expect(result.statusDescription).toBeUndefined();
  });
});
