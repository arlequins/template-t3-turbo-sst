import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const authRouter = {
  me: protectedProcedure.query(({ ctx }) => ({
    id: ctx.session.user.id,
    name: ctx.session.user.name,
    email: ctx.session.user.email,
  })),
} satisfies TRPCRouterRecord;
