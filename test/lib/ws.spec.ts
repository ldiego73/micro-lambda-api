import {
  connection,
  disconnect,
  message,
  actionRegister,
} from "../data/data.ws";
import { Api, ApiSocket, HttpStatus, MiddlewareError } from "../../lib";

describe("WebSocket", () => {
  it("should be a valid Api", () => {
    const api = new Api();

    expect(api).toBeInstanceOf(Api);
  });

  it("should be and valid connection", async () => {
    const api = new Api();
    const socket = new ApiSocket();

    socket.connect((request) => {
      return { id: request.connectionId };
    });
    socket.use((request, response) => {
      request.log.info("id", { _id: request.connectionId });
      response.send({ _id: request.connectionId });
    });

    api.use(socket.actions());
    api.use(socket.middlewares());

    const result = await api.listen(connection.event, connection.context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.body).toBe(
      JSON.stringify({ id: connection.event.requestContext.connectionId })
    );
  });

  it("should be and valid disconnection", async () => {
    const api = new Api();
    const socket = new ApiSocket();

    socket.disconnect((request) => {
      return { id: request.connectionId };
    });
    socket.use((request, response) => {
      request.log.info("id", { _id: request.connectionId });
      response.send({ _id: request.connectionId });
    });

    api.use(socket.actions());
    api.use(socket.middlewares());

    const result = await api.listen(disconnect.event, disconnect.context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.body).toBe(
      JSON.stringify({ id: disconnect.event.requestContext.connectionId })
    );
  });

  it("should be and valid message", async () => {
    const api = new Api();
    const socket = new ApiSocket();

    socket.action("message", (request) => {
      return { id: request.connectionId };
    });
    socket.use((request, response) => {
      request.log.info("id", { _id: request.connectionId });
      response.send({ _id: request.connectionId });
    });

    api.use(socket.actions());
    api.use(socket.middlewares());

    const result = await api.listen(message.event, message.context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.body).toBe(
      JSON.stringify({ id: message.event.requestContext.connectionId })
    );
  });

  it("should be and empty result action", async () => {
    const api = new Api();
    const socket = new ApiSocket();

    socket.action("message", (request) => {
      request.log.info("action empty");
    });
    socket.use((request, response) => {
      request.log.info("id", { _id: request.connectionId });
      response.send({ _id: request.connectionId });
    });

    api.use(socket.actions());
    api.use(socket.middlewares());

    const result = await api.listen(message.event, message.context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.body).toBe("");
  });

  it("should be and valid action with name 'register'", async () => {
    const api = new Api();
    const socket = new ApiSocket();

    socket.action("register", (_, response) => {
      response.status(HttpStatus.CREATED).send({ status: true });
    });
    socket.use((request) => {
      request.log.info("id", { _id: request.connectionId });
      return { _id: request.connectionId };
    });

    api.use(socket.actions());
    api.use(socket.middlewares());

    const result = await api.listen(
      actionRegister.event,
      actionRegister.context
    );

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.CREATED);
    expect(result.body).toBe(JSON.stringify({ status: true }));
  });

  it("should be an invalid middleware", () => {
    const socket = new ApiSocket();
    const middleware: any = null;

    socket.action("message", (request) => {
      return { id: request.connectionId };
    });

    expect(() => socket.use(middleware)).toThrow(MiddlewareError);
  });

  it("should be and invalid action", async () => {
    const api = new Api();
    const socket = new ApiSocket();

    socket.action("id", (request) => {
      return { id: request.connectionId };
    });
    socket.use((request, response) => {
      request.log.info("id", { _id: request.connectionId });
      response.send({ _id: request.connectionId });
    });

    api.use(socket.actions());
    api.use(socket.middlewares());

    const result = await api.listen(message.event, message.context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it("should be 0 actions", async () => {
    const api = new Api();
    const socket = new ApiSocket();

    socket.use((request, response) => {
      request.log.info("id", { _id: request.connectionId });
      response.send({ _id: request.connectionId });
    });

    api.use(socket.actions());
    api.use(socket.middlewares());

    const result = await api.listen(message.event, message.context);

    expect(api).toBeInstanceOf(Api);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
  });
});
