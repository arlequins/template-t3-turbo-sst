import { desc, eq } from "@acme/db-backbone";

import type { Database } from "@acme/db-backbone/client";
import { Post } from "@acme/db-backbone/schema";
import type { Logger } from "@acme/logger";
import type { Cache } from "@acme/s3-cache";
import type { CreatePostInput } from "@acme/validators";
import type { InferSelectModel } from "drizzle-orm";

type PostRow = InferSelectModel<typeof Post>;

const DEFAULT_LIST_LIMIT = 10;
const MAX_LIST_LIMIT = 50;
const POST_CACHE_TTL_SECONDS = 60;

export type PostServiceOptions = {
  cache?: Cache;
  cacheTtlSeconds?: number;
};

/**
 * Post domain: Drizzle access and light business rules (e.g. list limit) in one place.
 */
export function createPostService(
  database: Database,
  logger: Logger,
  options: PostServiceOptions = {},
) {
  const cache = options.cache;
  const cacheTtlSeconds = options.cacheTtlSeconds ?? POST_CACHE_TTL_SECONDS;

  return {
    listPosts(limit = DEFAULT_LIST_LIMIT): Promise<PostRow[]> {
      const capped = Math.min(Math.max(1, limit), MAX_LIST_LIMIT);
      logger.debug("post.list", { limit: capped });
      const load = () =>
        database.query.Post.findMany({
          orderBy: desc(Post.id),
          limit: capped,
        });
      return cache
        ? cache.getOrSet(`list:${capped}`, load, {
            ttlSeconds: cacheTtlSeconds,
          })
        : load();
    },

    getPostById(id: string): Promise<PostRow | undefined> {
      logger.debug("post.get", { postId: id });
      const load = () =>
        database.query.Post.findFirst({
          where: eq(Post.id, id),
        });
      return cache
        ? cache.getOrSet(`by-id:${id}`, load, {
            ttlSeconds: cacheTtlSeconds,
          })
        : load();
    },

    async createPost(input: CreatePostInput) {
      logger.info("post.create");
      const result = await database.insert(Post).values(input);
      await cache?.clear();
      return result;
    },

    async deletePost(id: string) {
      logger.info("post.delete", { postId: id });
      const result = await database.delete(Post).where(eq(Post.id, id));
      await cache?.clear();
      return result;
    },
  };
}

export type PostService = ReturnType<typeof createPostService>;
