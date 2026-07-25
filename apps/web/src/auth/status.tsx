"use client";

import { Button } from "@acme/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";

import { useTRPC } from "~/trpc/react";
import { useAuth } from "./provider";

export function AuthStatus(props: { compact?: boolean }) {
  const { isLoading, login, logout, user } = useAuth();
  const trpc = useTRPC();
  const session = useQuery(
    trpc.auth.me.queryOptions(undefined, { enabled: Boolean(user) }),
  );

  if (isLoading) {
    return (
      <Button className="transition-none" disabled>
        Checking session
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        className="transition-none"
        onClick={() => void login()}
        variant="secondary"
      >
        Sign in
      </Button>
    );
  }

  const displayName =
    typeof user.profile.name === "string"
      ? user.profile.name
      : user.profile.preferred_username;

  return (
    <div className="flex items-center gap-3">
      <span
        className={props.compact ? "hidden" : "text-muted-foreground text-sm"}
      >
        {displayName ?? user.profile.sub}
      </span>
      {session.data && (
        <>
          <span
            className={
              props.compact ? "sr-only" : "text-muted-foreground text-sm"
            }
            data-testid="api-session"
          >
            API session: {session.data.name ?? session.data.id}
          </span>
          {session.data.roles.includes("admin") && (
            <span
              className="bg-primary/10 text-primary hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium sm:inline-flex"
              title="Administrator"
            >
              <ShieldCheck className="size-3" />
              Admin
            </span>
          )}
        </>
      )}
      <Button
        className="transition-none"
        size={props.compact ? "sm" : "default"}
        variant="secondary"
        onClick={() => void logout()}
      >
        Sign out
      </Button>
    </div>
  );
}
