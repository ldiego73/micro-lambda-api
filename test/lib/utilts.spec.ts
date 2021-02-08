import { getPathKeys, getPathValues, normalizePath, parseBody } from "../../lib";

describe("Utils", () => {
  it("should be a valid path", () => {
    const path = normalizePath("/users////");

    expect(path).toBe("/users");
  });

  it("should be a valid body", () => {
    const body = parseBody(`{"id":1,"name":"admin","status":true}`);

    expect(body).toMatchObject({ id: 1, name: "admin", status: true });
  });

  it("should be a invalid body", () => {
    const body = parseBody("{ hello world }");

    expect(body).not.toBeInstanceOf(Object);
    expect(body).toBe("{ hello world }");
  });

  it("should be a valid params keys", () => {
    const keys = getPathKeys("/users/:id");

    expect(keys).toBeInstanceOf(Object);
    expect(keys).toMatchObject(["id"]);
  });

  it("should be a invalid params keys", () => {
    const keys = getPathKeys("http:mydomain.com");

    expect(keys).toBeNull();
  });

  it("should be a valid params values", () => {
    const values = getPathValues("/users/:id", "/users/1");

    expect(values).toBeInstanceOf(Object);
    expect(values).toMatchObject(["1"]);
  });
});
