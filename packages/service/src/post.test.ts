import type { Database } from "@acme/db-backbone/client";
import type { LogRecord } from "@acme/logger";
import { createLogger } from "@acme/logger";
import { describe, expect, it, vi } from "vitest";
import { createPostService } from "./post";

describe("createPostService", () => {
  it("preserves request context in service logs", async () => {
    const records: LogRecord[] = [];
    const findMany = vi.fn().mockResolvedValue([]);
    const database = {
      query: { Post: { findMany } },
    } as unknown as Database;
    const logger = createLogger({
      service: "api",
      bindings: { component: "post-service", requestId: "request-123" },
      sink: (record) => records.push(record),
    });

    await createPostService(database, logger).listPosts(100);

    expect(findMany).toHaveBeenCalledOnce();
    expect(records).toEqual([
      expect.objectContaining({
        component: "post-service",
        limit: 50,
        message: "post.list",
        requestId: "request-123",
      }),
    ]);
  });
});
