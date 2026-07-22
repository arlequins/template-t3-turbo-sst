import type { Database } from "@acme/db-backbone/client";
import type { LogRecord } from "@acme/logger";
import { createLogger } from "@acme/logger";
import type { Cache } from "@acme/s3-cache";
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

  it("caches database reads through an injected cache", async () => {
    const findFirst = vi.fn().mockResolvedValue({ id: "post-1" });
    const database = {
      query: { Post: { findFirst } },
    } as unknown as Database;
    const getOrSet = vi.fn(
      async (_key: string, loader: () => Promise<unknown>) => loader(),
    );
    const cache = { getOrSet } as unknown as Cache;
    const logger = createLogger({ service: "test", sink: () => undefined });

    await createPostService(database, logger, { cache }).getPostById("post-1");

    expect(getOrSet).toHaveBeenCalledWith(
      "by-id:post-1",
      expect.any(Function),
      { ttlSeconds: 60 },
    );
    expect(findFirst).toHaveBeenCalledOnce();
  });
});
