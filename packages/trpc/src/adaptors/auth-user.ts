import type { UserProvisioningPort } from "@acme/auth";
import { AppRole } from "@acme/auth";
import { db } from "@acme/db-backbone/client";
import { AppUser, UserRole } from "@acme/db-backbone/schema";
import { eq } from "drizzle-orm";

const validRoles = new Set<string>(Object.values(AppRole));

export const databaseUserProvisioning: UserProvisioningPort = {
  async provision(input) {
    return db.transaction(async (tx) => {
      const [user] = await tx
        .insert(AppUser)
        .values({ ...input, lastLoginAt: new Date() })
        .onConflictDoUpdate({
          target: [AppUser.issuer, AppUser.subject],
          set: {
            name: input.name,
            email: input.email,
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          },
        })
        .returning();
      if (!user) throw new Error("OIDC user provisioning returned no user");

      await tx
        .insert(UserRole)
        .values({ userId: user.id, role: AppRole.MEMBER })
        .onConflictDoNothing();
      const rows = await tx
        .select({ role: UserRole.role })
        .from(UserRole)
        .where(eq(UserRole.userId, user.id));
      const roles = rows
        .map(({ role }) => role)
        .filter((role): role is AppRole => validRoles.has(role));

      return { ...user, roles };
    });
  },
};
