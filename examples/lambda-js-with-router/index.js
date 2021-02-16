const { Api, ApiRouter, HttpStatus } = require("micro-lambda-api");
const { routes } = require("./router");

const api = new Api();

api.use(routes);

exports.handler = async (event, context) => {
  return await api.listen(event, context);
};
