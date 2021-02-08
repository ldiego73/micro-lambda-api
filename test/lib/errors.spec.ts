import { ApiError, HttpError, HttpMethod, MethodError, MiddlewareError, RouteError } from "../../lib";

describe("Errors", () => {
  it("should be an HttpError", () => {
    const error = new HttpError("HTTP_ERROR", "Unknown error");

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe("HTTP_ERROR");
    expect(error.message).toBe("Unknown error");
  });

  it("should be an MethodError", () => {
    const error = new MethodError("/users", "GET");

    expect(error).toBeInstanceOf(HttpError);
    expect(error.code).toBe(ApiError.METHOD_NOT_ALLOWED);
    expect(error.message).toBe("Method Not Allowed");
    expect(error.method).toBe(HttpMethod.GET);
  });

  it("should be an RouteError", () => {
    const error = new RouteError("/users");

    expect(error).toBeInstanceOf(HttpError);
    expect(error.code).toBe(ApiError.ROUTE_NOT_FOUND);
    expect(error.message).toBe("Route not found");
    expect(error.path).toBe("/users");
  });

  it("should be an MiddlewareError", () => {
    const error = new MiddlewareError();

    expect(error).toBeInstanceOf(HttpError);
    expect(error.code).toBe(ApiError.MIDDLEWARE_ERROR);
    expect(error.message).toBe("Middleware is invalid");
  });
});
