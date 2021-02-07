![Miro Lambda API](images/icon.svg)

**Micro Lambda API** is a small library for AWS Lambda that provides an easy way to use routing with AWS API Gateway and AWS Application Load Balancer services for API.

That library has taken reference to some libraries such as:

- Lambda API (https://github.com/jeremydaly/lambda-api)
- Koa Router (https://github.com/ZijianHe/koa-router/)
- AWS Lambda Router (https://github.com/art-dc/aws-lambda-router)

## Caracteristicas

- Integration with Gateway Lambda Proxy Integrator API using REST API or HTTP API.
- Integration with ALB Lambda Target Support.
- Enabling CORS for requests.
- No external dependencies.
- You can use the separate `Request` and `Response`. Without requiring the final
- Midleware router to run after all middleware and routes have been completed.
- Creating multiple routers to handle different versions.
- Typescript support

## Instalación

Installation via `npm`

```
npm install micro-lambda-api
```

or `yarn`

```
yarn add micro-lambda-api
```

## Inicio rápido

Using JavaScript

```js
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
```

Using TypeScript

```ts
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
```

## API Reference

- [Router](#router)
  - Methods (get, post, patch, put, delete) ⇒ `ApiRouter`
  - Middleware => `ApiRouter`
  - Router prefixes
  - Router responses
  - Functions
    - routes()
    - middlewares()
  - Static
    - getRouteParams(route, path)
- [Request](#request)
  - Properties
    - id
    - stage
    - method
    - path
    - query
    - params
    - headers()
    - body
    - host
    - ip
    - userAgent
    - proxyIntegration
    - isBase64Encoded
- [Response](#response)
  - Options
  - Methods
    - status(code) ⇒ `ApiResponse`
    - header(key, value) ⇒ `ApiResponse`
    - cors(options) ⇒ `ApiResponse`
    - getResponse()
    - send(payload, isError)
    - json(body)
    - html(body)
    - file(body)
    - error(data)
- [`finally`](#finally)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)
- [Support](#support)

## Router

Class that defines the different HTTP methods

Basic use

```ts
import { Api, ApiRouter } from "micro-lambda-api";

const api = new Api();
const router = new ApiRouter();

router.get("/", (req, res) => {
  // Process and return data
});

app.use(router.routes()).use(router.middlewares());
```

### Options

| Parameer              | Type   | Description                               |
| --------------------- | ------ | ----------------------------------------- |
| `basePath` (Optional) | String | Prefix of all routes                      |
| `version` (Optional)  | String | Router version number. Example: v2        |

Examples:

```ts
const router = new ApiRouter({
  basePath: "/users",
});
```

```ts
const router = new ApiRouter({
  version: "v2",
});
```

```ts
const router = new ApiRouter({
  basePath: "/users",
  version: "v3",
});
```

### Methods ⇒ `ApiRouter`

Router defines the following 5 methods: `get`, `post`, `patch`, `put`, `delete`

```ts
router
  .get("/users", async (req, res) => {
    const users = await getUsers();

    return users;
  })
  .post("/users", async (req, res) => {
    await saveUsers();

    return true;
  })
  .patch("/users/:id", async (req, res) => {
    const user = updateStatus(req.param.id, true);

    return user;
  })
  .put("/users/:id", async (req, res) => {
    const user = updateUser(user);

    return user;
  })
  .delete("/users/:id", async (req, res) => {
    await deleteUser(req.param.id);

    return true;
  });
```

When a route is not found it will return the following error: `RouteError`.

When a method is not found it will return the following error: `MethodError`.

### Middleware => `ApiRouter`

Middlewares are functions that allow them to be executed before any route.

Example:

```ts
router.use((req, res) => {
  req.executionStart = performance.now();
});
```

Multiple middlewares can be nested

```ts
router
  .use((req, res) => {
    // Middleware 1
  })
  .use((req, res) => {
    // Middleware 2
  })
  .use((req, res) => {
    // Middleware 3
  });
```

> NOTE: Remember that middlewares run according to the order that were created. 

### Router prefixes

When a `basePath` is defined, a prefix is added to all routes that you define.

Example:

```ts
const router = new ApiRouter({ basePath: "/users" });

router
  .get("/", ...) // responds to /users
  .put("/:id", ...) // responds to /users/100
  .post("/:id/save", ...) // responds to /users/100/save
```

### Router responses

There are 2 ways to respond to the execution of a route

Using the response class:

```ts
router.get("/users", (req, res) => {
  res.send([
    { id: 1, username: "admin" },
    { id: 2, username: "demo" },
  ]);
});
```

Using `return`:

```ts
router.get("/users", (req, res) => {
  return [
    { id: 1, username: "admin" },
    { id: 2, username: "demo" },
  ];
});
```

The `response` class provides more functionality such as, for example, changing the response status, adding custom headers, enabling cors, and so on

You can also combine the use of `response` with `return`:

```ts
router.get("/users", (req, res) => {
  res.status(201);
  res.cors();
  res.header("x-custom-header", "my-header");

  return [
    { id: 1, username: "admin" },
    { id: 2, username: "demo" },
  ];
});
```

### Functions

#### `routes()`

Returns an array with the routes that were defined.

```ts
router.routes();
```

#### `middlewares()`

Returns an array with the middlewares that were defined.

```ts
router.middlewares();
```

### Static

#### `getRouteParams(route, path)`

A method that is not part of the Router class and is used to get the parameters of a URL.

| Parameter | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| `route`   | String | Route with dynamic parameters                 |
| `path`    | String | The url that was invoked by the user          |

Example:

```ts
const params = getRouteParams("/users/:id/:username", "/users/1/admin");
// return { id: 1, username: "admin" }
```

## Request

The request class allows you to parse the event that was invoked through an API Gateway or Application Load Balancer.

So you don't need to use all the functionality of the paths, api, errors, etc., you can use it in your Lambda `handler` function.

Example:
```js
exports.handler = (event, context) => {
  const request = new ApiRequest(event);

  console.log(request.query);
  console.log(request.params);
  console.log(request.body);
}
```

> NOTE: Remember that while the Request class is independent it uses some functions that are within `utils` and `http`.

### Properties

1. `id`

    Transaction ID
    Example: `dc6128b3-bdcb-464d-a1e1-009b041ff9b9`

2. `stage`

    If you are working with API Gateway Stages, it will contain a value.
    Example: `develop`.
    
    If you set no stage in the Gateway API by default it will be empty.

3. `method`

    Identifies the HTTP Method. Possible values: `GET`, `PUT`, `POST`, etc.

4. `path`

    Identify the URL. Example: `/users`.

5. `query`

    Returns in an object all parameters that were passed in the URL query.
    Example: `{id: 100}`

6. `params`

    By default, return an empty object. If you do not work with the `API` class to be able to assign it a value must use the function: `getRouteParams(route, path)`.

7. `headers()`

    Returns an array of all headers in the request. Header names will be lowercase.

8. `body`

    Returns an object with all the parameters returned in the request body. Only works with `content-type` `application/json` or `application/x-www-form-urlencoded`. 
    
    > NOTE: Doesn't support binary content. Example: files.

9. `host`

    Returns the host that invoked the request. 
    
    If ALB, the DNS will return.

    If API Gateway will return the domain.

10. `ip`

    Returns the first ip found in the request.

11. `userAgent`

    Returns the `User-Agent` sent in the header.

12. `proxyIntegration`

    Identifies what integration your Lambda has.
    
    The values to return are: `elb` or `apigw-rest-api` or `apigw-http-api`.

13. `isBase64Encoded`

    A Boolean value that identifies whether the body is in base64

You can add additional parameters if you are working with `ApiRouter` this will allow you to have more customization when you are using middlewares.

## Response

The response class allows you to configure and return the response that Lambda will return to the Gateway API or Application Load Balancer.

If you don't need to use all the functionality of your paths, api, errors, etc., you can use it in your Lambda `handler` function.

Example:
```js
exports.handler = (event, context) => {
  ...
  const response = new ApiResponse();

  return response
    .status(200)
    .send({
      id: 1,
      name: "admin",
      status: true
    });
}
```

### Options

Options are only available if you use without Api and Router.

| Option        | Type    | Description                                                        |
|---------------|---------|--------------------------------------------------------------------|
| `cors`        | boolean | Static value that enable the headers cors in all responses.        |
| `credentials` | boolean | Static value that enable the headers credentials in all responses. |
| `request`     | object  | Parameter optional in the initialization the class.                |

Example:
```js
exports.handler = (event, context) => {
  const request = new ApiRequest(event, context);
  ...
  ApiResponse.cors = true;
  ApiResponse.credentials = true;

  const response = new ApiResponse(request);

  response.status(200);
  response.header("my-custom-header", "my-header");

  return response
    .send({
      id: 1,
      name: "admin",
      status: true
    });
}
```

### Methods

#### status(code) ⇒ `ApiResponse`

Sets the status of the response that was returned to the Gateway API or ALB. By default, the response status is `200` and `500` for a general error.

Status `405` is used when the method does not exist and `404` when the route is not found.

For better control you can use the HttpStatus object which has a listing of all http codes that you can return.

Example:
```js
router.get("/", (req, res) => {
  res.status(HttpStatus.OK).send(true);
})
```

#### header(key, value) ⇒ `ApiResponse`

Use the header function if you want to add custom header that They will be returned to the Gateway API or ALB.

Remember that all keys will be converted to lowercase.

Example:
```js
router.get("/", (req, res) => {
  res.header("X-Custom-Header", "my-custom-header");
  // return to "x-custom-header" in lowercase
  ...
})
```

#### cors(options) ⇒ `ApiResponse`

Allows you to add custom cors for each request. If you want to work with the cors by default, use the static value cors.

Example:
```js
router.get("/", (req, res) => {
  res.cors({
    credentials: true,
    origin: "https://mydomain.com",
  });
  ...
})
```

#### getResponse()

Returns the previous object that will be returned.

Structure:

```ts
interface Response {
  isBase64Encoded: boolean;
  statusCode: number;
  statusDescription?: string;
  body: string;
  headers: {
    [key: string]: string | undefined;
  };
}
```

#### send(payload, isError)

Allows you to send a json object or string that will be transformed to a string that is the data that API Gateway or ALB expects to receive.

The parameter isError is optional is used only by the method `error`.

```js
res.send("Hola Mundo");

// Return
{
  isBase64Encoded: false;
  statusCode: 200;
  body: "Hola Mundo";
  headers: {
    ...
  };
}
```

Or

```js
res.send({
  id: 1,
  name: "admin",
  status: true
});

// Return
{
  isBase64Encoded: false;
  statusCode: 200;
  body: "{'user': 1, 'name': 'admin', 'status': true}";
  headers: {
    ...
  };
}
```

#### json(body)

A metode that defaults to the `conten-type` header in `application/json` And that receives as a parameter a JSON.

```js
res.json({
  id: 1,
  name: "admin",
  status: true
});
```

#### html(body)

A metode that defaults to the `conten-type` header in `text/html; charset=UTF-8` And that receives as a parameter a String.

```js
res.json("<h1>Hello World</h1>");
```

#### file(body)

A metode that defaults to the `conten-type` header in `tapplication/octet-stream` And that receives as a parameter a String.

```js
res.json("This is a file");
```

#### error(data)

A metode that receives as a parameter an object with a structure Predefined (ResponseError) that will be sent to the `send` method

Structure:

```ts
interface ResponseError {
  status?: HttpStatus;
  code: string;
  message: string;
  data?: {
    [key: string]: unknown;
  };
}
```

Remember that if you use the response object only, you must assign the status of the response.

Example:

```js
res.status(400);
res.error(...);
```

You can use a throw to generate an exception in your route and be captured by the global error handler.

Example:

```js
router.get("/", () => {
  throw Error("Unknow error");
});

// Return
{
  status: 500,
  code: "GENERIC_ERROR",
  message: "Unknow Error",
}
```

All errors extend from the `HttpError` class and this In turn of the generic class `Error`.

```ts
class HttpError extends Error {
  constructor(public code: string, public message: string) {
    super(message);
  }
}
```

## `finally`

An api functionality is 'finally' which is a middleware that is invoked at the end of all executions (paths and middlewares) used if you want to clean variables, connect to database, perform tracing, and so on.

```js
api.finally((req, res) => {
  ...
});
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us. 

## Versioning

The repository use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags](https://github.com/ldiego73/micro-lambda-api/tags).

## Authors

- Luis Diego - Project Creator - [ldiego73](https://github.com/ldiego73)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ldiego73/micro-lambda-api/blob/main/LICENSE) file for details.

## Support

If you have any problem or suggestion please open an [issue](https://github.com/ldiego73/micro-lambda-api/issues) here.
