/* eslint-disable security-node/detect-crlf */
/* eslint-disable no-console */

import { context, event } from "../data/data.alb";
import {
  Api,
  ApiRequest,
  ApiResponse,
  ApiRouter,
  HttpIntegration,
  HttpMethod,
  HttpStatus,
} from "../../src";
import { performance } from "perf_hooks";
import { deepCopy } from "../utils";

describe("Handler with AWS Application Loader Balancer", () => {
  const api = new Api({ logger: { pretty: true, trace: false } });
  const router = new ApiRouter();

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

  it("should be the event an ELB", () => {
    expect(event.requestContext.elb).not.toBeUndefined();
    expect(typeof event.requestContext.elb === "object").toBeTruthy();
  });

  it("should be a valid request", () => {
    const request = new ApiRequest(event, context);

    expect(request.id).toBe(context.awsRequestId);
    expect(request.method).toBe(event.httpMethod);
    expect(request.path).toBe(event.path);
    expect(request.headers).toMatchObject(event.headers);
    expect(typeof request.body).toBe("object");
    expect(request.host).toBe(event.headers.host);
    expect(event.headers["x-forwarded-for"]).toContain(request.ip);
    expect(request.userAgent).toBe(event.headers["user-agent"]);
    expect(request.stage).toBe("");
    expect(request.proxyIntegration).toBe(HttpIntegration.ALB);
    expect(request.isBase64Encoded).toBe(event.isBase64Encoded);
  });

  it("should run the route of GET /", async () => {
    const _event = deepCopy(event);

    _event.path = "";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBe(
      `${HttpStatus.OK} ${HttpStatus[HttpStatus.OK]}`
    );
  });

  it("should run the route of GET /users", async () => {
    const _event = deepCopy(event);

    _event.path = "/users";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBe(
      `${HttpStatus.OK} ${HttpStatus[HttpStatus.OK]}`
    );
  });

  it("should run the route of POST /users", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.POST;
    _event.path = "/users";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.CREATED);
    expect(result.statusDescription).toBe(
      `${HttpStatus.CREATED} ${HttpStatus[HttpStatus.CREATED]}`
    );
  });

  it("should run the route of GET /users/export", async () => {
    const _event = deepCopy(event);

    _event.path = "/users/export";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBe(
      `${HttpStatus.OK} ${HttpStatus[HttpStatus.OK]}`
    );
  });

  it("should run the route of GET /users/:id", async () => {
    const _event = deepCopy(event);
    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.statusDescription).toBe(
      `${HttpStatus.OK} ${HttpStatus[HttpStatus.OK]}`
    );
  });

  it("should run the route of DELETE /users/:id", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.DELETE;
    _event.path = "/users/300/////";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
    expect(result.statusDescription).toBe(
      `${HttpStatus.NO_CONTENT} ${HttpStatus[HttpStatus.NO_CONTENT]}`
    );
  });

  it("should be validate that the route does not exist", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.GET;
    _event.path = "/users/100/profile";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.statusDescription).toBe(
      `${HttpStatus.NOT_FOUND} ${HttpStatus[HttpStatus.NOT_FOUND]}`
    );
  });

  it("should be validate that the method not allowed", async () => {
    const _event = deepCopy(event);

    _event.httpMethod = HttpMethod.PATCH;
    _event.path = "/users/100/profile";

    const result = await api.listen(_event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.METHOD_NOT_ALLOWED);
    expect(result.statusDescription).toBe(
      `${HttpStatus.METHOD_NOT_ALLOWED} ${
        HttpStatus[HttpStatus.METHOD_NOT_ALLOWED]
      }`
    );
  });
});
