import type {
  AppRole as AppRoleType,
  UserAdministrationPort,
} from "@acme/auth";
import type { Database } from "@acme/db-backbone/client";
import { AppUser, UserRole } from "@acme/db-backbone/schema";
import { asc, eq } from "drizzle-orm";

export function createDatabaseUserAdministration(
  database: Database,
): UserAdministrationPort {
  return {
    async list() {
      const [users, roleRows] = await Promise.all([
        database.select().from(AppUser).orderBy(asc(AppUser.createdAt)),
        database.select().from(UserRole),
      ]);
      const rolesByUser = new Map<string, AppRoleType[]>();
      for (const row of roleRows) {
        const roles = rolesByUser.get(row.userId) ?? [];
        roles.push(row.role as AppRoleType);
        rolesByUser.set(row.userId, roles);
      }
      return users.map((user) => ({
        ...user,
        roles: rolesByUser.get(user.id) ?? [],
      }));
    },

    async setRoles(userId, roles) {
      return database.transaction(async (tx) => {
        const [user] = await tx
          .select()
          .from(AppUser)
          .where(eq(AppUser.id, userId))
          .limit(1);
        if (!user) return undefined;
        await tx.delete(UserRole).where(eq(UserRole.userId, userId));
        await tx
          .insert(UserRole)
          .values(roles.map((role) => ({ role, userId })));
        return { ...user, roles };
      });
    },
  };
}
