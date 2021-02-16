import { Api } from "micro-lambda-api";
import { routes } from "./router";

const api = new Api();

api.use(routes);

export async function handler(event: any, context: any) {
  return await api.listen(event, context);
}
