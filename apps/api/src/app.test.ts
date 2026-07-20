import { describe, expect, it, vi } from "vitest";

import { createApiApp } from "./app";

describe("API app", () => {
  const app = createApiApp({ corsOrigins: ["http://localhost:3000"] });

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
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await app.request("/api/trpc/missing");

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toContain("No procedure found");
    errorLog.mockRestore();
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
