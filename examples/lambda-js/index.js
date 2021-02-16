const { Api, ApiRouter, HttpStatus } = require("micro-lambda-api");

const api = new Api();
const router = new ApiRouter({
  basePath: "/users",
});

router.get("/", () => {
  return [];
});
router.post("/", (req, res) => {
  res.status(HttpStatus.NO_CONTENT).send("");
});
router.put("/:id", async (req) => {
  return { id: req.params.id };
});

api.use(router.routes());

exports.handler = async (event, context) => {
  return await api.listen(event, context);
};
