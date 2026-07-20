"use client";

import { Button } from "@acme/ui/button";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { useAuth } from "./provider";

export function AuthStatus() {
  const { isLoading, login, logout, user } = useAuth();
  const trpc = useTRPC();
  const session = useQuery(
    trpc.auth.me.queryOptions(undefined, { enabled: Boolean(user) }),
  );

  if (isLoading) {
    return <Button disabled>Checking session</Button>;
  }

  if (!user) {
    return <Button onClick={() => void login()}>Sign in</Button>;
  }

  const displayName =
    typeof user.profile.name === "string"
      ? user.profile.name
      : user.profile.preferred_username;

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm">
        {displayName ?? user.profile.sub}
      </span>
      {session.data && (
        <span
          className="text-muted-foreground text-sm"
          data-testid="api-session"
        >
          API session: {session.data.id}
        </span>
      )}
      <Button variant="outline" onClick={() => void logout()}>
        Sign out
      </Button>
    </div>
  );
}
