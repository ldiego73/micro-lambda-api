const { ApiRouter, HttpStatus } = require("micro-lambda-api");

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

module.exports = {
  routes: router.routes(),
};
