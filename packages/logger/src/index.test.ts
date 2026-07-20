import { describe, expect, it } from "vitest";

import type { LogRecord } from "./index";
import { createLogger } from "./index";

describe("createLogger", () => {
  it("emits structured child bindings", () => {
    const records: LogRecord[] = [];
    const logger = createLogger({
      service: "api",
      sink: (record) => records.push(record),
      now: () => new Date("2026-01-01T00:00:00.000Z"),
    });

    logger.child({ requestId: "request-1" }).info("request.completed", {
      status: 200,
    });

    expect(records).toEqual([
      {
        level: "info",
        message: "request.completed",
        requestId: "request-1",
        service: "api",
        status: 200,
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("redacts sensitive fields recursively", () => {
    const records: LogRecord[] = [];
    const logger = createLogger({
      service: "api",
      sink: (record) => records.push(record),
    });

    logger.error("request.failed", {
      authorization: "Bearer value",
      nested: { accessToken: "token", safe: "visible" },
    });

    expect(records[0]).toMatchObject({
      authorization: "[REDACTED]",
      nested: { accessToken: "[REDACTED]", safe: "visible" },
    });
  });
});
