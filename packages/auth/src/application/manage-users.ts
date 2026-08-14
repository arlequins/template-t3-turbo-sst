import { AppRole } from "../domain/authorization";
import type { UserAdministrationPort } from "./ports/user-administration";

export function createUserAdministration(
  port: UserAdministrationPort,
  options: { actorUserId: string },
) {
  return {
    listUsers() {
      return port.list();
    },

    async updateRoles(userId: string, roles: AppRole[]) {
      const normalized = [...new Set(roles)];
      if (normalized.length === 0) {
        throw new Error("At least one role is required");
      }
      if (
        userId === options.actorUserId &&
        !normalized.includes(AppRole.ADMIN)
      ) {
        throw new Error("Administrators cannot remove their own admin role");
      }
      const user = await port.setRoles(userId, normalized);
      if (!user) throw new Error("User not found");
      return user;
    },
  };
}

export type UserAdministration = ReturnType<typeof createUserAdministration>;
