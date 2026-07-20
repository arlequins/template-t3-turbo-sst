import type { LogRecord } from "@acme/logger";
import { createLogger } from "@acme/logger";
import { describe, expect, it } from "vitest";

import { createApiApp } from "./app";

describe("API app", () => {
  const app = createApiApp({
    corsOrigins: ["http://localhost:3000"],
    logger: createLogger({ service: "api", sink: () => {} }),
  });

  it("reports service health", async () => {
    const response = await app.request("/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "ok" });
    expect(response.headers.get("x-request-id")).toBeTruthy();
  });

  it("returns a structured not-found response", async () => {
    const response = await app.request("/missing");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      error: "Not Found",
    });
  });

  it("mounts the tRPC fetch handler", async () => {
    const response = await app.request("/api/trpc/missing");

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toContain("No procedure found");
  });

  it("propagates the request ID into HTTP and tRPC logs", async () => {
    const records: LogRecord[] = [];
    const loggedApp = createApiApp({
      corsOrigins: ["http://localhost:3000"],
      logger: createLogger({
        service: "api",
        sink: (record) => records.push(record),
      }),
    });

    await loggedApp.request("/api/trpc/missing", {
      headers: { "X-Request-Id": "request-123" },
    });

    expect(records).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "trpc.request.failed",
          requestId: "request-123",
        }),
        expect.objectContaining({
          message: "http.request.completed",
          requestId: "request-123",
        }),
      ]),
    );
  });

  it("allows configured browser origins", async () => {
    const response = await app.request("/api/trpc", {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization,trpc-accept",
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
    expect(response.headers.get("access-control-allow-headers")).toContain(
      "Trpc-Accept",
    );
  });
});
