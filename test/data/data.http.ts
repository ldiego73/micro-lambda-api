export const event = {
  version: "2.0",
  routeKey: "ANY /users/{proxy+}",
  rawPath: "/develop/users/100",
  rawQueryString: "city=Lima&country=PE&users=user1,user2,user3",
  headers: {
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "content-length": "70",
    "content-type": "application/json",
    host: "hvkg4qkhw8.execute-api.us-east-1.amazonaws.com",
    "user-agent": "PostmanRuntime/7.26.8",
    "x-amzn-trace-id": "Root=1-601b80ad-764daecc0829e2e934a0c88d",
    "x-api-key": "ldiego",
    "x-forwarded-for": "179.6.220.91",
    "x-forwarded-port": "443",
    "x-forwarded-proto": "https",
    "x-token": "123",
  },
  queryStringParameters: {
    city: "Lima",
    country: "PE",
    users: "user1,user2,user3",
  },
  requestContext: {
    accountId: "527645708144",
    apiId: "hvkg4qkhw8",
    domainName: "hvkg4qkhw8.execute-api.us-east-1.amazonaws.com",
    domainPrefix: "hvkg4qkhw8",
    http: {
      method: "GET",
      path: "/develop/users/100",
      protocol: "HTTP/1.1",
      sourceIp: "179.6.220.91",
      userAgent: "PostmanRuntime/7.26.8",
    },
    requestId: "aNELHhr8oAMEJhg=",
    routeKey: "ANY /users/{proxy+}",
    stage: "develop",
    time: "04/Feb/2021:05:05:49 +0000",
    timeEpoch: 1612415149476,
  },
  pathParameters: { proxy: "100" },
  body:
    '{"username":"ldiego73","password":"ldiego73","age":31,"status": false}',
  isBase64Encoded: false,
};

export const context = {
  awsRequestId: "dc6128b3-bdcb-464d-a1e1-009b041ff9b9",
};
