import { ApiRouter, MiddlewareError } from "../../src";

describe("Router", () => {
  let router: ApiRouter;

  beforeEach(() => {
    router = new ApiRouter({
      basePath: "/users",
      version: "v2",
    });
  });

  it("should be an Router", () => {
    expect(router).toBeInstanceOf(ApiRouter);
    expect(router.routes()).toMatchObject([]);
    expect(router.middlewares()).toMatchObject([]);
  });

  it("should be create a Middleware", () => {
    router.use(() => {
      return [];
    });

    expect(router.middlewares()).not.toBeUndefined();
    expect(router.middlewares()).not.toBeNull();
    expect(router.middlewares().length).toBe(1);
  });

  it("should be an invalid Middleware", () => {
    const middleware: any = null;

    expect(() => router.use(middleware)).toThrow(MiddlewareError);
  });

  it("should be add a route", () => {
    router.get("/", () => { return true });
    router.post("/", () => { return true });
    router.put("/:id", () => { return true });
    router.patch("/:id", () => { return true });
    router.delete("/:id", () => { return true });

    expect(router.routes().length).toBe(5);
  });
});
