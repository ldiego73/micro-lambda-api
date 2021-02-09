import { Logger, LoggerOptions } from "../../src";
import { uuidv4 } from "../../src/uuid";

describe("Logger", () => {
  beforeAll(() => {
    const options: LoggerOptions = {
      context: {
        functionName: "myFunction",
        functionVersion: "1.0.0",
        memoryLimitInMB: 1024,
        invokedFunctionArn: "my:arn:myFunction",
      },
      handler: () => true,
    };

    Logger.configure(options);
  });

  it("should be an Logger", () => {
    const log = Logger.create();

    log.trace("Log trace");
    log.debug("Log debug");
    log.info("Log info");
    log.warn("Log warn");
    log.error("Log error");
    log.fatal("Log fatal");

    expect(log).toBeInstanceOf(Logger);
    expect(log.toLog()).toBeInstanceOf(Object);
  });

  it("should be print a log with group", () => {
    Logger.configure();

    const log = Logger.create();
    const logGroup = log.group("log_group");

    logGroup.info("This is a log");

    expect(log).toBeInstanceOf(Logger);
    expect(log.toLog()).toBeInstanceOf(Object);
    expect(log.toLog().group).toBe("log_group");
  });

  it("should be print a log with extras", () => {
    const log = Logger.create();
    const data = { id: uuidv4() };

    log.removeExtra("context");
    log.clearExtras();
    log.addExtra("context", data);
    log.trace("This is a trace");

    expect(log).toBeInstanceOf(Logger);
    expect(log.toLog()).toBeInstanceOf(Object);
    expect(log.getExtra("context")).toMatchObject(data);
  });

  it("should be add an invalid extra", () => {
    Logger.configure({ pretty: true });

    const log = Logger.create();

    expect(() => {
      log.addExtra("time", new Date().getTime());
    }).toThrow(Error);

    log.error("extra invalid");

    expect(log).toBeInstanceOf(Logger);
    expect(log.toLog()).toBeInstanceOf(Object);
  });
});
