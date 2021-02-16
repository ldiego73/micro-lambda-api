import {
  ApiRequest,
  ApiResponse,
  ApiRouter,
  HttpStatus,
} from "micro-lambda-api";

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

export const routes = router.routes();
