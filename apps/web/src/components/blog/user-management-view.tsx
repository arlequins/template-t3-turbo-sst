"use client";

import { AppRole } from "@acme/auth/authorization";
import type { RouterOutputs } from "@acme/trpc/client";
import { getTrpcUserFacingMessage } from "@acme/trpc/client";
import { Alert } from "@acme/ui/alert";
import { Button } from "@acme/ui/button";
import { EmptyState } from "@acme/ui/empty-state";
import { Input } from "@acme/ui/input";
import { Select } from "@acme/ui/select";
import { Skeleton } from "@acme/ui/skeleton";
import { toast } from "@acme/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { useTRPC } from "~/trpc/react";

type ManagedUser = RouterOutputs["auth"]["users"][number];

function displayName(user: ManagedUser): string {
  return user.name ?? user.email ?? user.id;
}

function initials(user: ManagedUser): string {
  return displayName(user)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserManagementView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const users = useQuery(trpc.auth.users.queryOptions());
  const updateRoles = useMutation(
    trpc.auth.updateUserRoles.mutationOptions({
      onError: (error) => toast.error(getTrpcUserFacingMessage(error)),
      onSuccess: async () => {
        toast.success("User role updated");
        await queryClient.invalidateQueries(trpc.auth.users.pathFilter());
        await queryClient.invalidateQueries(trpc.auth.me.pathFilter());
      },
    }),
  );
  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users.data ?? [];
    return (users.data ?? []).filter((user) =>
      `${user.name ?? ""} ${user.email ?? ""} ${user.roles.join(" ")}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, users.data]);

  if (users.isPending)
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((key) => (
          <Skeleton className="h-20 w-full" key={key} />
        ))}
      </div>
    );

  if (users.isError)
    return (
      <Alert variant="destructive">
        {getTrpcUserFacingMessage(users.error)}
        <Button
          className="ml-3"
          onClick={() => users.refetch()}
          size="sm"
          variant="outline"
        >
          <RefreshCw />
          Retry
        </Button>
      </Alert>
    );

  return (
    <section className="bg-background overflow-hidden rounded-lg border shadow-xs">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1" htmlFor="user-search">
          <span className="sr-only">Search users</span>
          <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
          <Input
            className="pl-9"
            id="user-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search identity or role"
            value={query}
          />
        </label>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <ShieldCheck className="text-primary size-4" />
          Roles are stored by the application
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <EmptyState
          description="Users appear after their first successful OIDC sign in."
          icon={Users}
          title="No managed users"
        />
      )}

      <div className="divide-y">
        {filteredUsers.map((user) => (
          <article
            className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_180px_150px] sm:items-center sm:px-5"
            key={user.id}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {initials(user)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">
                  {displayName(user)}
                </h2>
                <p className="text-muted-foreground truncate text-xs">
                  {user.email ?? user.id}
                </p>
              </div>
            </div>

            <label
              className="text-muted-foreground text-xs"
              htmlFor={`role-${user.id}`}
            >
              Application role
              <Select
                className="mt-1.5"
                disabled={updateRoles.isPending}
                id={`role-${user.id}`}
                onChange={(event) =>
                  updateRoles.mutate({
                    roles: [event.target.value as AppRole],
                    userId: user.id,
                  })
                }
                value={
                  user.roles.includes(AppRole.ADMIN)
                    ? AppRole.ADMIN
                    : user.roles.includes(AppRole.MEMBER)
                      ? AppRole.MEMBER
                      : AppRole.VIEWER
                }
              >
                <option value={AppRole.ADMIN}>Administrator</option>
                <option value={AppRole.MEMBER}>Editor</option>
                <option value={AppRole.VIEWER}>Viewer</option>
              </Select>
            </label>

            <div className="text-muted-foreground text-xs sm:text-right">
              <p>
                Last sign in{" "}
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                }).format(user.lastLoginAt)}
              </p>
              <p className="mt-1">
                Joined{" "}
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                }).format(user.createdAt)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
