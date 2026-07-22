import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { Database } from "./client";
import { createDrizzlePostRepository } from "./post-repository";
import * as schema from "./schema";

describe("Drizzle post repository integration", () => {
  let container: Awaited<ReturnType<PostgreSqlContainer["start"]>>;
  let sql: ReturnType<typeof postgres>;
  let repository: ReturnType<typeof createDrizzlePostRepository>;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:18-alpine").start();
    sql = postgres(container.getConnectionUri(), { max: 2 });
    const database = drizzle({ client: sql, schema, casing: "snake_case" });
    await migrate(database, {
      migrationsFolder: new URL("../drizzle", import.meta.url).pathname,
    });
    repository = createDrizzlePostRepository(database as Database);
  }, 60_000);

  afterAll(async () => {
    await sql?.end({ timeout: 5 });
    await container?.stop();
  });

  it("runs a complete repository lifecycle against migrated PostgreSQL", async () => {
    const created = await repository.create({
      content: "Integration testing with an isolated database",
      title: "Container-backed content",
    });
    await expect(repository.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      title: "Container-backed content",
    });
    await expect(
      repository.list({
        direction: "asc",
        page: 1,
        pageSize: 10,
        query: "isolated",
        sort: "title",
      }),
    ).resolves.toMatchObject({ total: 1 });
    await expect(
      repository.update(created.id, {
        content: "Updated body",
        title: "Updated title",
      }),
    ).resolves.toMatchObject({ title: "Updated title" });
    await expect(repository.delete(created.id)).resolves.toBe(true);
    await expect(repository.findById(created.id)).resolves.toBeUndefined();
  });
});
