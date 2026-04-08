import type { InferSelectModel } from "drizzle-orm";

import type { Database } from "@acme/db/client";
import { desc, eq } from "@acme/db";
import { Post } from "@acme/db/schema";
import type { CreatePostInput } from "@acme/validators";

type PostRow = InferSelectModel<typeof Post>;

const DEFAULT_LIST_LIMIT = 10;
const MAX_LIST_LIMIT = 50;

/**
 * Post domain: Drizzle access and light business rules (e.g. list limit) in one place.
 */
export function createPostService(database: Database) {
  return {
    listPosts(limit = DEFAULT_LIST_LIMIT): Promise<PostRow[]> {
      const capped = Math.min(Math.max(1, limit), MAX_LIST_LIMIT);
      return database.query.Post.findMany({
        orderBy: desc(Post.id),
        limit: capped,
      });
    },

    getPostById(id: string): Promise<PostRow | undefined> {
      return database.query.Post.findFirst({
        where: eq(Post.id, id),
      });
    },

    createPost(input: CreatePostInput) {
      return database.insert(Post).values(input);
    },

    deletePost(id: string) {
      return database.delete(Post).where(eq(Post.id, id));
    },
  };
}

export type PostService = ReturnType<typeof createPostService>;
