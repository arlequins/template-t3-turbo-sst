"use client";

import { Button } from "@acme/ui/button";

import { useAuth } from "./provider";

export function AuthStatus() {
  const { isLoading, login, logout, user } = useAuth();

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
      <Button variant="outline" onClick={() => void logout()}>
        Sign out
      </Button>
    </div>
  );
}
