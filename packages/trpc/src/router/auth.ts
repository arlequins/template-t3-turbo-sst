import { AppRole, Permission } from "@acme/auth";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { permissionProcedure, protectedProcedure } from "../trpc";

export const authRouter = {
  me: protectedProcedure.query(({ ctx }) => ({
    id: ctx.session.user.id,
    name: ctx.session.user.name,
    email: ctx.session.user.email,
    roles: ctx.session.user.roles,
  })),
  users: permissionProcedure(Permission.USER_ADMIN).query(({ ctx }) => {
    const service = ctx.services.userAdministration;
    if (!service) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return service.listUsers();
  }),
  updateUserRoles: permissionProcedure(Permission.USER_ADMIN)
    .input(
      z.object({
        roles: z.array(z.enum(AppRole)).min(1),
        userId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = ctx.services.userAdministration;
      if (!service) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      try {
        return await service.updateRoles(input.userId, input.roles);
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Unable to update roles",
        });
      }
    }),
} satisfies TRPCRouterRecord;
