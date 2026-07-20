import { Permission } from "@acme/auth";
import { createPostInputSchema } from "@acme/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { permissionProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => ctx.services.post.listPosts()),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.services.post.getPostById(input.id)),

  create: permissionProcedure(Permission.POST_WRITE)
    .input(createPostInputSchema)
    .mutation(({ ctx, input }) => ctx.services.post.createPost(input)),

  delete: permissionProcedure(Permission.POST_WRITE)
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.services.post.deletePost(input);
    }),
} satisfies TRPCRouterRecord;
