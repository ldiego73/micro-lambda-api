import { context, event } from "../data/data.http";
import {
  Api,
  ApiError,
  ApiRequest,
  ApiResponse,
  HttpContentTypes,
  HttpStatus,
  ResponseError,
} from "../../src";
import { deepCopy } from "../utils";

describe("Handler with AWS API Gateway HTTP API", () => {
  const api = new Api();

  it("should validate when no routes exist", async () => {
    const result = await api.listen(event, context);

    expect(result).not.toBeUndefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Object);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it("should response using ApiResponse", () => {
    const request = new ApiRequest(event, context);
    const response = new ApiResponse(request);
    const result = response.send(request.body);

    expect(result.body).toBe(JSON.stringify(request.body));
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.isBase64Encoded).toBe(request.isBase64Encoded);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse with error", () => {
    const request = new ApiRequest(event, context);
    const response = new ApiResponse(request);
    const responseError: ResponseError = {
      status: HttpStatus.BAD_REQUEST,
      code: ApiError.GENERIC_ERROR,
      message: "Unknown Error",
    };
    const result = response.status(HttpStatus.BAD_REQUEST).error(responseError);

    expect(result.body).toBe(JSON.stringify(responseError));
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.isBase64Encoded).toBeFalsy();
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse with json", () => {
    const _event = deepCopy(event);

    _event.body = {
      username: "ldiego",
      password: "ldiego",
      age: 31,
      status: true,
    };

    const request = new ApiRequest(_event, context);
    const response = new ApiResponse(request);
    const result = response.json(request.body);

    expect(result.body).toBe(JSON.stringify(request.body));
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.headers["content-type"]).toBe(HttpContentTypes.JSON);
    expect(result.isBase64Encoded).toBe(request.isBase64Encoded);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse with html", () => {
    const _event = deepCopy(event);

    _event.body = "username=ldiego&password=ldiego&age=31&status=true";
    _event.headers["content-type"] = HttpContentTypes.FORM;

    const html = "<h1>Lambda handler response HTML</h1>";
    const request = new ApiRequest(_event, context);
    const response = new ApiResponse(request);
    const result = response.html(html);

    expect(result.body).toBe(html);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.headers["content-type"]).toBe(HttpContentTypes.HTML);
    expect(result.isBase64Encoded).toBe(request.isBase64Encoded);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse with file", () => {
    const file = "Lambda handler response File";
    const request = new ApiRequest(event, context);
    const response = new ApiResponse(request);
    const result = response.file(file);

    expect(result.body).toBe(file);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.headers["content-type"]).toBe(HttpContentTypes.BINARY);
    expect(result.isBase64Encoded).toBe(request.isBase64Encoded);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse without request", () => {
    const response = new ApiResponse();
    const result = response.cors().send("Heelo World");

    expect(result.body).toBe("Heelo World");
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.isBase64Encoded).toBe(false);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse with cors", () => {
    const response = new ApiResponse();
    const result = response
      .cors({
        credentials: true,
        maxAge: 1000,
        exposeHeaders: "Access-Control-Allow-Credentials",
      })
      .send("Heelo World");

    expect(result.body).toBe("Heelo World");
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.isBase64Encoded).toBe(false);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse with return empty", () => {
    const response = new ApiResponse();
    const result = response
      .send();

    expect(typeof result.body).toBe("string");
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.isBase64Encoded).toBe(false);
    expect(result.statusDescription).toBeUndefined();
  });

  it("should response using ApiResponse with string error", () => {
    const response = new ApiResponse();
    const result = response
      .error("Is an error");

    expect(typeof result.body).toBe("string");
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.isBase64Encoded).toBe(false);
    expect(result.statusDescription).toBeUndefined();
  });
});
