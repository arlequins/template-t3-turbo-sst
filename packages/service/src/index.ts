import { db } from "@acme/db/client";

import type { PostService } from "./post";
import { createPostService } from "./post";

export const postService = createPostService(db);
export type { PostService };
