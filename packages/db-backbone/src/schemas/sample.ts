import { sql } from "drizzle-orm";
import { pgSchema, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sample = pgSchema("sample");

const contentCategories = ["design", "engineering", "notes"] as const;
const contentLocales = ["en", "ja", "ko"] as const;
const contentStatuses = ["approved", "draft", "in-review"] as const;

export const Post = sample.table(
  "post",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    title: t.varchar({ length: 256 }).notNull(),
    slug: t.varchar({ length: 256 }).notNull().default("untitled"),
    description: t.varchar({ length: 240 }).notNull().default(""),
    content: t.text().notNull(),
    category: t
      .varchar({ enum: contentCategories, length: 32 })
      .notNull()
      .default("notes"),
    status: t
      .varchar({ enum: contentStatuses, length: 32 })
      .notNull()
      .default("draft"),
    locale: t
      .varchar({ enum: contentLocales, length: 8 })
      .notNull()
      .default("en"),
    translationKey: t.varchar({ length: 256 }).notNull().default("untitled"),
    image: t.text().notNull().default("/blog/editorial-workspace.jpg"),
    imageAlt: t.varchar({ length: 240 }).notNull().default(""),
    featured: t.boolean().notNull().default(false),
    publishedAt: t.timestamp({ mode: "date", withTimezone: true }),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => sql`now()`),
    version: t.integer().default(1).notNull(),
  }),
  (table) => [
    uniqueIndex("post_locale_slug_uidx").on(table.locale, table.slug),
  ],
);

export const IdempotencyRecord = sample.table(
  "idempotency_record",
  (t) => ({
    completedAt: t.timestamp({ withTimezone: true }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    expiresAt: t.timestamp({ withTimezone: true }).notNull(),
    fingerprint: t.varchar({ length: 128 }).notNull(),
    key: t.varchar({ length: 256 }).notNull(),
    result: t.jsonb(),
    scope: t.varchar({ length: 128 }).notNull(),
  }),
  (table) => [primaryKey({ columns: [table.scope, table.key] })],
);

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
