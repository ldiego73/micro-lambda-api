/* eslint-disable security-node/detect-crlf */
/* eslint-disable no-console */

import { context, event } from "./data/data.http";
import { Api } from "../src/api";
import {
  ApiRequest,
  ApiResponse,
  ApiRouter,
  HttpIntegration,
  HttpMethod,
  HttpStatus,
} from "../src";
import { performance } from "perf_hooks";
import { deepCopy } from "./utils";

describe("Handler with AWS API Gateway HTTP API", () => {
  const api = new Api();
  const router = new ApiRouter({ basePath: "/users" });

  beforeAll(() => {
    ApiResponse.cors = true;
    ApiResponse.credentials = true;

    router
      .use((req) => {
        req.start = performance.now();
      })
      .get("/", (req) => {
        return req.body;
      })
      .post("/", (_, res) => {
        res.status(HttpStatus.CREATED);

        return { userId: Math.random() };
      })
      .get("/export", (_, res) => {
        res.html("<h1>Average 100</h1>>");
      })
      .get("/:id", (req: ApiRequest, res: ApiResponse) => {
        res.json(req.body);
      })
      .put("/:id", (_, res) => {
        res.status(HttpStatus.CREATED).send();
      })
      .patch("/:id", (_, res) => {
        res.status(HttpStatus.NO_CONTENT).send();
      })
      .delete("/:id", (req, res) => {
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
    expect(event.version).toBe("2.0");
    expect(typeof event.requestContext === "object").toBeTruthy();
  });

  it("should be a valid request", () => {
    const _event = deepCopy(event);
    const request = new ApiRequest(_event, context);

    expect(request.id).toBe(context.awsRequestId);
    expect(request.method).toBe(event.requestContext.http.method);
    expect(`/${request.stage}${request.path}`).toBe(
      event.requestContext.http.path
    );
    expect(request.headers).toMatchObject(event.headers);
    expect(typeof request.body).toBe("object");
    expect(request.host).toBe(event.headers.host);
    expect(event.requestContext.http.sourceIp).toContain(request.ip);
    expect(request.userAgent).toBe(event.headers["user-agent"]);
    expect(request.stage).toBe(event.requestContext.stage);
    expect(request.proxyIntegration).toBe(HttpIntegration.APIGW_HTTP_API);
    expect(request.isBase64Encoded).toBe(event.isBase64Encoded);
  });

  it("should run the route of GET /users", async () => {
    const _event = deepCopy(event);

    _event.rawPath = "/develop/users";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should run the route of POST /users", async () => {
    const _event = deepCopy(event);

    _event.requestContext.http.method = HttpMethod.POST;
    _event.rawPath = "/develop/users";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.CREATED);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should run the route of GET /users/export", async () => {
    const _event = deepCopy(event);

    _event.rawPath = "/develop/users/export";

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

  it("should run the route of PATCH /users/:id", async () => {
    const _event = deepCopy(event);

    _event.requestContext.http.method = HttpMethod.PATCH;
    _event.rawPath = "/develop/users/300/////";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should run the route of DELETE /users/:id", async () => {
    const _event = deepCopy(event);

    _event.requestContext.http.method = HttpMethod.DELETE;
    _event.rawPath = "/develop/users/300/////";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should be validate that the route does not exist", async () => {
    const _event = deepCopy(event);

    _event.requestContext.http.method = HttpMethod.GET;
    _event.rawPath = "/develop/users/100/profile";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.statusDescription).toBeUndefined();
  });
});
