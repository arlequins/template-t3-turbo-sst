import { desc, eq } from "@acme/db-backbone";

import type { Database } from "@acme/db-backbone/client";
import { Post } from "@acme/db-backbone/schema";
import type { Logger } from "@acme/logger";
import type { CreatePostInput } from "@acme/validators";
import type { InferSelectModel } from "drizzle-orm";

type PostRow = InferSelectModel<typeof Post>;

const DEFAULT_LIST_LIMIT = 10;
const MAX_LIST_LIMIT = 50;

/**
 * Post domain: Drizzle access and light business rules (e.g. list limit) in one place.
 */
export function createPostService(database: Database, logger: Logger) {
  return {
    listPosts(limit = DEFAULT_LIST_LIMIT): Promise<PostRow[]> {
      const capped = Math.min(Math.max(1, limit), MAX_LIST_LIMIT);
      logger.debug("post.list", { limit: capped });
      return database.query.Post.findMany({
        orderBy: desc(Post.id),
        limit: capped,
      });
    },

    getPostById(id: string): Promise<PostRow | undefined> {
      logger.debug("post.get", { postId: id });
      return database.query.Post.findFirst({
        where: eq(Post.id, id),
      });
    },

    createPost(input: CreatePostInput) {
      logger.info("post.create");
      return database.insert(Post).values(input);
    },

    deletePost(id: string) {
      logger.info("post.delete", { postId: id });
      return database.delete(Post).where(eq(Post.id, id));
    },
  };
}

export type PostService = ReturnType<typeof createPostService>;
