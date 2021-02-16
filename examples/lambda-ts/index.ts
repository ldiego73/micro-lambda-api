import {
  Api,
  ApiRequest,
  ApiResponse,
  ApiRouter,
  HttpStatus,
} from "micro-lambda-api";

const api = new Api();
const router = new ApiRouter({
  basePath: "/users",
});

router.get("/", () => {
  return [];
});
router.post("/", (req: ApiRequest, res: ApiResponse) => {
  res.status(HttpStatus.NO_CONTENT).send("");
});
router.put("/:id", async (req: ApiRequest) => {
  return { id: req.params.id };
});

api.use(router.routes());

export async function handler(event: any, context: any) {
  return await api.listen(event, context);
}
