import { createHash } from "node:crypto";

import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { parse, stringify } from "superjson";

export const CacheNamespace = {
  API: "api",
  DATABASE: "db",
} as const;

export type CacheSetOptions = {
  ttlSeconds?: number;
};

export type Cache = {
  clear(): Promise<number>;
  delete(key: string): Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
  getOrSet<T>(
    key: string,
    loader: () => Promise<T>,
    options?: CacheSetOptions,
  ): Promise<T>;
  namespace(name: string): Cache;
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
};

export type S3CacheOptions = {
  bucket: string;
  client?: S3Client;
  defaultTtlSeconds?: number;
  errorMode?: "bypass" | "throw";
  now?: () => number;
  onError?: (error: unknown, operation: string) => void;
  prefix?: string;
};

type CacheEnvelope = {
  expiresAt: number;
  value: unknown;
  version: 1;
};

type CacheState = Required<
  Pick<S3CacheOptions, "bucket" | "defaultTtlSeconds" | "errorMode" | "now">
> & {
  client: S3Client;
  inFlight: Map<string, Promise<unknown>>;
  onError?: S3CacheOptions["onError"];
  rootPrefix: string;
};

function normalizeSegment(value: string, label: string): string {
  const trimmed = value.trim();
  let start = 0;
  let end = trimmed.length;
  while (start < end && trimmed[start] === "/") start += 1;
  while (end > start && trimmed[end - 1] === "/") end -= 1;
  const normalized = trimmed.slice(start, end);
  if (!normalized || !/^[a-zA-Z0-9._/-]+$/.test(normalized)) {
    throw new Error(
      `${label} must contain only letters, numbers, ., _, -, or /`,
    );
  }
  return normalized;
}

function normalizeBucket(value: string): string {
  const bucket = normalizeSegment(value, "S3 bucket");
  if (bucket.includes("/")) throw new Error("S3 bucket must be a bucket name");
  return bucket;
}

function parseEnvelope(source: string): CacheEnvelope {
  const value: unknown = parse(source);
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 1 ||
    !("expiresAt" in value) ||
    typeof value.expiresAt !== "number" ||
    !("value" in value)
  ) {
    throw new Error("Invalid S3 cache envelope");
  }
  return value as CacheEnvelope;
}

function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as {
    name?: string;
    $metadata?: { httpStatusCode?: number };
  };
  return (
    candidate.name === "NoSuchKey" ||
    candidate.$metadata?.httpStatusCode === 404
  );
}

function objectHash(key: string): string {
  if (!key.trim()) throw new Error("Cache key must not be empty");
  return createHash("sha256").update(key).digest("hex");
}

function buildCache(state: CacheState, namespaceParts: string[]): Cache {
  const namespacePrefix = [state.rootPrefix, ...namespaceParts].join("/");
  const objectKey = (key: string) =>
    `${namespacePrefix}/${objectHash(key)}.json`;

  async function recover<T>(
    operation: string,
    fallback: T,
    action: () => Promise<T>,
  ): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (isNotFound(error)) return fallback;
      state.onError?.(error, operation);
      if (state.errorMode === "throw") throw error;
      return fallback;
    }
  }

  const cache: Cache = {
    async get<T>(key: string): Promise<T | undefined> {
      const keyPath = objectKey(key);
      return recover("get", undefined, async () => {
        const response = await state.client.send(
          new GetObjectCommand({ Bucket: state.bucket, Key: keyPath }),
        );
        if (!response.Body) return undefined;
        const envelope = parseEnvelope(await response.Body.transformToString());
        if (envelope.expiresAt <= state.now()) {
          await cache.delete(key);
          return undefined;
        }
        return envelope.value as T;
      });
    },

    async set<T>(
      key: string,
      value: T,
      options: CacheSetOptions = {},
    ): Promise<void> {
      if (value === undefined) {
        throw new Error("Cache value must not be undefined");
      }
      const ttlSeconds = options.ttlSeconds ?? state.defaultTtlSeconds;
      if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
        throw new Error("Cache TTL must be a positive number of seconds");
      }
      const body = stringify({
        expiresAt: state.now() + ttlSeconds * 1_000,
        value,
        version: 1,
      } satisfies CacheEnvelope);
      await recover("set", undefined, async () => {
        await state.client.send(
          new PutObjectCommand({
            Body: body,
            Bucket: state.bucket,
            CacheControl: `private, max-age=${Math.floor(ttlSeconds)}`,
            ContentType: "application/json",
            Key: objectKey(key),
          }),
        );
      });
    },

    async delete(key: string): Promise<void> {
      await recover("delete", undefined, async () => {
        await state.client.send(
          new DeleteObjectCommand({
            Bucket: state.bucket,
            Key: objectKey(key),
          }),
        );
      });
    },

    async clear(): Promise<number> {
      return recover("clear", 0, async () => {
        let deleted = 0;
        let continuationToken: string | undefined;
        do {
          const response = await state.client.send(
            new ListObjectsV2Command({
              Bucket: state.bucket,
              ContinuationToken: continuationToken,
              Prefix: `${namespacePrefix}/`,
            }),
          );
          const objects = (response.Contents ?? []).flatMap(({ Key }) =>
            Key ? [{ Key }] : [],
          );
          if (objects.length > 0) {
            await state.client.send(
              new DeleteObjectsCommand({
                Bucket: state.bucket,
                Delete: { Objects: objects, Quiet: true },
              }),
            );
            deleted += objects.length;
          }
          continuationToken = response.IsTruncated
            ? response.NextContinuationToken
            : undefined;
        } while (continuationToken);
        return deleted;
      });
    },

    async getOrSet<T>(
      key: string,
      loader: () => Promise<T>,
      options: CacheSetOptions = {},
    ): Promise<T> {
      const cached = await cache.get<T>(key);
      if (cached !== undefined) return cached;

      const keyPath = objectKey(key);
      const existing = state.inFlight.get(keyPath) as Promise<T> | undefined;
      if (existing) return existing;

      const pending = loader().then(async (value) => {
        if (value !== undefined) await cache.set(key, value, options);
        return value;
      });
      state.inFlight.set(keyPath, pending);
      try {
        return await pending;
      } finally {
        state.inFlight.delete(keyPath);
      }
    },

    namespace(name: string): Cache {
      return buildCache(state, [
        ...namespaceParts,
        normalizeSegment(name, "Cache namespace"),
      ]);
    },
  };

  return cache;
}

export function createS3Cache(options: S3CacheOptions): Cache {
  const defaultTtlSeconds = options.defaultTtlSeconds ?? 300;
  if (!Number.isFinite(defaultTtlSeconds) || defaultTtlSeconds <= 0) {
    throw new Error("Default cache TTL must be a positive number of seconds");
  }
  const state: CacheState = {
    bucket: normalizeBucket(options.bucket),
    client: options.client ?? new S3Client({}),
    defaultTtlSeconds,
    errorMode: options.errorMode ?? "bypass",
    inFlight: new Map(),
    now: options.now ?? Date.now,
    onError: options.onError,
    rootPrefix: normalizeSegment(options.prefix ?? "cache", "Cache prefix"),
  };
  return buildCache(state, []);
}

export function createApplicationCaches(cache: Cache) {
  return {
    api: cache.namespace(CacheNamespace.API),
    database: cache.namespace(CacheNamespace.DATABASE),
  };
}
