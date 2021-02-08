import { event, context } from "../data/data.rest";
import { Api, ApiError, ApiRouter, HttpError, HttpStatus } from "../../lib";

describe("Api", () => {
  it("should be a valid Api", () => {
    const api = new Api();

    expect(api).toBeInstanceOf(Api);
  });

  it("should be add middleware finally", async () => {
    const api = new Api();
    const router = new ApiRouter();

    router.get("/", () => {
      throw Error();
    })

    api.use(router.routes()).finally(() => {
      return true;
    });

    event.path = "/";

    const result = await api.listen(event, context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it("should be and http error", async () => {
    const api = new Api();
    const router = new ApiRouter();

    router.get("/", () => {
      throw new HttpError(ApiError.GENERIC_ERROR, "");
    })

    api.use(router.routes());

    event.path = "/";

    const result = await api.listen(event, context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
