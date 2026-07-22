import type { S3Client } from "@aws-sdk/client-s3";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { describe, expect, it, vi } from "vitest";

import { createS3Cache } from "./index";

function createClientDouble() {
  const objects = new Map<string, string>();
  const send = vi.fn(async (command: object) => {
    if (command instanceof PutObjectCommand) {
      objects.set(command.input.Key!, String(command.input.Body));
      return {};
    }
    if (command instanceof GetObjectCommand) {
      const body = objects.get(command.input.Key!);
      if (body === undefined) {
        const error = new Error("missing");
        error.name = "NoSuchKey";
        throw error;
      }
      return { Body: { transformToString: async () => body } };
    }
    if (command instanceof DeleteObjectCommand) {
      objects.delete(command.input.Key!);
      return {};
    }
    if (command instanceof ListObjectsV2Command) {
      return {
        Contents: [...objects.keys()]
          .filter((key) => key.startsWith(command.input.Prefix!))
          .map((Key) => ({ Key })),
        IsTruncated: false,
      };
    }
    if (command instanceof DeleteObjectsCommand) {
      for (const object of command.input.Delete?.Objects ?? []) {
        if (object.Key) objects.delete(object.Key);
      }
      return {};
    }
    throw new Error("Unexpected command");
  });
  return { client: { send } as unknown as S3Client, objects, send };
}

describe("createS3Cache", () => {
  it("stores hashed keys and expires values", async () => {
    const double = createClientDouble();
    let now = 1_000;
    const cache = createS3Cache({
      bucket: "cache-bucket",
      client: double.client,
      now: () => now,
      prefix: "test",
    });

    await cache.set("user@example.com", { id: 1 }, { ttlSeconds: 10 });
    expect([...double.objects.keys()][0]).not.toContain("user@example.com");
    expect(await cache.get("user@example.com")).toEqual({ id: 1 });

    now = 11_001;
    expect(await cache.get("user@example.com")).toBeUndefined();
  });

  it("preserves values such as Date across serialization", async () => {
    const double = createClientDouble();
    const cache = createS3Cache({
      bucket: "cache-bucket",
      client: double.client,
    });
    const createdAt = new Date("2026-01-01T00:00:00.000Z");

    await cache.set("post:1", { createdAt });

    expect(await cache.get("post:1")).toEqual({ createdAt });
  });

  it("deduplicates concurrent cache misses", async () => {
    const double = createClientDouble();
    const cache = createS3Cache({
      bucket: "cache-bucket",
      client: double.client,
    });
    const loader = vi.fn(async () => ({ id: 1 }));

    const [left, right] = await Promise.all([
      cache.getOrSet("post:1", loader),
      cache.getOrSet("post:1", loader),
    ]);

    expect(left).toEqual({ id: 1 });
    expect(right).toEqual({ id: 1 });
    expect(loader).toHaveBeenCalledOnce();
  });

  it("clears only the selected namespace", async () => {
    const double = createClientDouble();
    const cache = createS3Cache({
      bucket: "cache-bucket",
      client: double.client,
    });
    const posts = cache.namespace("db/posts");
    const users = cache.namespace("db/users");
    await posts.set("1", { id: 1 });
    await users.set("1", { id: 1 });

    expect(await posts.clear()).toBe(1);
    expect(await posts.get("1")).toBeUndefined();
    expect(await users.get("1")).toEqual({ id: 1 });
  });

  it("bypasses S3 failures by default", async () => {
    const onError = vi.fn();
    const client = {
      send: vi.fn(async () => {
        throw new Error("S3 unavailable");
      }),
    } as unknown as S3Client;
    const cache = createS3Cache({ bucket: "cache-bucket", client, onError });

    expect(await cache.getOrSet("key", async () => "origin")).toBe("origin");
    expect(onError).toHaveBeenCalled();
  });

  it("does not cache undefined origin results", async () => {
    const double = createClientDouble();
    const cache = createS3Cache({
      bucket: "cache-bucket",
      client: double.client,
    });

    expect(
      await cache.getOrSet("missing", async () => undefined),
    ).toBeUndefined();
    expect(double.objects.size).toBe(0);
  });
});
