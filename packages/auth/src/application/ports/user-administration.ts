import type { AppRole } from "../../domain/authorization";

export type ManagedUser = {
  createdAt: Date;
  email: string | null;
  id: string;
  lastLoginAt: Date;
  name: string | null;
  roles: AppRole[];
};

export type UserAdministrationPort = {
  list(): Promise<ManagedUser[]>;
  setRoles(userId: string, roles: AppRole[]): Promise<ManagedUser | undefined>;
};
