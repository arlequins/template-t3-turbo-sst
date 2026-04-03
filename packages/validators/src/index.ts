import { z } from "zod/v4";

/** Shared with API `post.create` input — keep in sync with DB constraints */
export const createPostInputSchema = z.object({
  title: z.string().max(256),
  content: z.string().max(256),
});
