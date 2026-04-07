import { db } from "@acme/db/client";

import { createPostService, PostService } from "./post";

export const postService = createPostService(db);
export type { PostService };
