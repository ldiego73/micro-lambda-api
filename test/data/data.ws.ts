export const connection = {
  event: {
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
      "Cache-Control": "no-cache",
      Host: "qdzojyej9a.execute-api.us-east-1.amazonaws.com",
      Origin: "http://localhost:4200",
      Pragma: "no-cache",
      "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
      "Sec-WebSocket-Key": "+ixyMe7d6E/NlsPNKVUqGg==",
      "Sec-WebSocket-Version": "13",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
      "X-Amzn-Trace-Id": "Root=1-6030942c-0354a6446d8ffbea455d43cc",
      "X-Forwarded-For": "179.6.213.250",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https",
    },
    multiValueHeaders: {
      "Accept-Encoding": ["gzip, deflate, br"],
      "Accept-Language": ["en-US,en;q=0.9,es;q=0.8"],
      "Cache-Control": ["no-cache"],
      Host: ["qdzojyej9a.execute-api.us-east-1.amazonaws.com"],
      Origin: ["http://localhost:4200"],
      Pragma: ["no-cache"],
      "Sec-WebSocket-Extensions": [
        "permessage-deflate; client_max_window_bits",
      ],
      "Sec-WebSocket-Key": ["+ixyMe7d6E/NlsPNKVUqGg=="],
      "Sec-WebSocket-Version": ["13"],
      "User-Agent": [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
      ],
      "X-Amzn-Trace-Id": ["Root=1-6030942c-0354a6446d8ffbea455d43cc"],
      "X-Forwarded-For": ["179.6.213.250"],
      "X-Forwarded-Port": ["443"],
      "X-Forwarded-Proto": ["https"],
    },
    requestContext: {
      routeKey: "$connect",
      disconnectStatusCode: null,
      messageId: null,
      eventType: "CONNECT",
      extendedRequestId: "bBwW5F0_IAMFWvw=",
      requestTime: "20/Feb/2021:04:46:36 +0000",
      messageDirection: "IN",
      disconnectReason: null,
      stage: "develop",
      connectedAt: 1613796396038,
      requestTimeEpoch: 1613796396039,
      identity: {
        cognitoIdentityPoolId: null,
        cognitoIdentityId: null,
        principalOrgId: null,
        cognitoAuthenticationType: null,
        userArn: null,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        accountId: null,
        caller: null,
        sourceIp: "179.6.213.250",
        accessKey: null,
        cognitoAuthenticationProvider: null,
        user: null,
      },
      requestId: "bBwW5F0_IAMFWvw=",
      domainName: "qdzojyej9a.execute-api.us-east-1.amazonaws.com",
      connectionId: "bBwW5cjUoAMCEdg=",
      apiId: "qdzojyej9a",
    },
    isBase64Encoded: false,
  },
  context: {
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: "$LATEST",
    functionName: "ws-test-service-develop-connectHandler",
    memoryLimitInMB: "1024",
    logGroupName: "/aws/lambda/ws-test-service-develop-connectHandler",
    logStreamName: "2021/02/20/[$LATEST]6f539efab9fa4ff4bf4cb95c9a0fb8d3",
    invokedFunctionArn:
      "arn:aws:lambda:us-east-1:527645708144:function:ws-test-service-develop-connectHandler",
    awsRequestId: "4148d7b0-fd63-4549-a6c4-4142db2d6910",
  },
};

export const disconnect = {
  event: {
    headers: {
      Host: "qdzojyej9a.execute-api.us-east-1.amazonaws.com",
      "x-api-key": "",
      "X-Forwarded-For": "",
      "x-restapi": "",
    },
    multiValueHeaders: {
      Host: ["qdzojyej9a.execute-api.us-east-1.amazonaws.com"],
      "x-api-key": [""],
      "X-Forwarded-For": [""],
      "x-restapi": [""],
    },
    requestContext: {
      routeKey: "$disconnect",
      disconnectStatusCode: 1001,
      messageId: null,
      eventType: "DISCONNECT",
      extendedRequestId: "bBwUFGV0oAMFx5w=",
      requestTime: "20/Feb/2021:04:46:18 +0000",
      messageDirection: "IN",
      disconnectReason: "Going away",
      stage: "develop",
      connectedAt: 1613795777877,
      requestTimeEpoch: 1613796378026,
      identity: {
        cognitoIdentityPoolId: null,
        cognitoIdentityId: null,
        principalOrgId: null,
        cognitoAuthenticationType: null,
        userArn: null,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        accountId: null,
        caller: null,
        sourceIp: "179.6.213.250",
        accessKey: null,
        cognitoAuthenticationProvider: null,
        user: null,
      },
      requestId: "bBwUFGV0oAMFx5w=",
      domainName: "qdzojyej9a.execute-api.us-east-1.amazonaws.com",
      connectionId: "bBu2Tf2mIAMCLLg=",
      apiId: "qdzojyej9a",
    },
    isBase64Encoded: false,
  },
  context: {
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: "$LATEST",
    functionName: "ws-test-service-develop-connectHandler",
    memoryLimitInMB: "1024",
    logGroupName: "/aws/lambda/ws-test-service-develop-connectHandler",
    logStreamName: "2021/02/20/[$LATEST]6f539efab9fa4ff4bf4cb95c9a0fb8d3",
    invokedFunctionArn:
      "arn:aws:lambda:us-east-1:527645708144:function:ws-test-service-develop-connectHandler",
    awsRequestId: "31f7c80f-b788-476c-ae4f-4c9b272e20b5",
  },
};

export const message = {
  event: {
    requestContext: {
      routeKey: "$default",
      disconnectStatusCode: null,
      messageId: "bEROSdA2IAMCKUw=",
      eventType: "MESSAGE",
      extendedRequestId: "bEROSGonIAMFz9w=",
      requestTime: "20/Feb/2021:23:04:46 +0000",
      messageDirection: "IN",
      disconnectReason: null,
      stage: "develop",
      connectedAt: 1613862286407,
      requestTimeEpoch: 1613862286531,
      identity: {
        cognitoIdentityPoolId: null,
        cognitoIdentityId: null,
        principalOrgId: null,
        cognitoAuthenticationType: null,
        userArn: null,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        accountId: null,
        caller: null,
        sourceIp: "179.6.213.250",
        accessKey: null,
        cognitoAuthenticationProvider: null,
        user: null,
      },
      requestId: "bEROSGonIAMFz9w=",
      domainName: "qdzojyej9a.execute-api.us-east-1.amazonaws.com",
      connectionId: "bERORdAvoAMCKUw=",
      apiId: "qdzojyej9a",
    },
    body: '{"action":"message","data":{"userId":0.2246979953380568}}',
    isBase64Encoded: false,
  },
  context: {
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: "$LATEST",
    functionName: "ws-test-service-develop-defaultHandler",
    memoryLimitInMB: "1024",
    logGroupName: "/aws/lambda/ws-test-service-develop-defaultHandler",
    logStreamName: "2021/02/20/[$LATEST]8b18780d73fd4b11b6642b3b4e34243b",
    invokedFunctionArn:
      "arn:aws:lambda:us-east-1:527645708144:function:ws-test-service-develop-defaultHandler",
    awsRequestId: "2221940b-ebf7-4230-997a-7bf6b539261b",
  },
};

export const actionRegister = {
  event: {
    requestContext: {
      routeKey: "register",
      disconnectStatusCode: null,
      messageId: "bEROSdA2IAMCKUw=",
      eventType: "MESSAGE",
      extendedRequestId: "bEROSGonIAMFz9w=",
      requestTime: "20/Feb/2021:23:04:46 +0000",
      messageDirection: "IN",
      disconnectReason: null,
      stage: "develop",
      connectedAt: 1613862286407,
      requestTimeEpoch: 1613862286531,
      identity: {
        cognitoIdentityPoolId: null,
        cognitoIdentityId: null,
        principalOrgId: null,
        cognitoAuthenticationType: null,
        userArn: null,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        accountId: null,
        caller: null,
        sourceIp: "179.6.213.250",
        accessKey: null,
        cognitoAuthenticationProvider: null,
        user: null,
      },
      requestId: "bEROSGonIAMFz9w=",
      domainName: "qdzojyej9a.execute-api.us-east-1.amazonaws.com",
      connectionId: "bERORdAvoAMCKUw=",
      apiId: "qdzojyej9a",
    },
    body: '{"action":"register","data":{"userId":0.2246979953380568}}',
    isBase64Encoded: false,
  },
  context: {
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: "$LATEST",
    functionName: "ws-test-service-develop-defaultHandler",
    memoryLimitInMB: "1024",
    logGroupName: "/aws/lambda/ws-test-service-develop-defaultHandler",
    logStreamName: "2021/02/20/[$LATEST]8b18780d73fd4b11b6642b3b4e34243b",
    invokedFunctionArn:
      "arn:aws:lambda:us-east-1:527645708144:function:ws-test-service-develop-defaultHandler",
    awsRequestId: "2221940b-ebf7-4230-997a-7bf6b539261b",
  },
};
