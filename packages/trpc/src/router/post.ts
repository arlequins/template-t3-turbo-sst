import { postService } from "@acme/service";
import { createPostInputSchema } from "@acme/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(() => postService.listPosts()),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => postService.getPostById(input.id)),

  create: protectedProcedure
    .input(createPostInputSchema)
    .mutation(({ input }) => postService.createPost(input)),

  delete: protectedProcedure.input(z.string()).mutation(({ input }) => {
    return postService.deletePost(input);
  }),
} satisfies TRPCRouterRecord;
