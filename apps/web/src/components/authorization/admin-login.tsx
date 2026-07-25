"use client";

import { AppRole } from "@acme/auth/authorization";
import { Button } from "@acme/ui/button";
import { Skeleton } from "@acme/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, KeyRound, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { useAuth } from "~/auth/provider";
import { brandConfig } from "~/config/brand.config";
import { useTRPC } from "~/trpc/react";

export function AdminLogin() {
  const { isLoading, login, user } = useAuth();
  const trpc = useTRPC();
  const session = useQuery(
    trpc.auth.me.queryOptions(undefined, {
      enabled: Boolean(user),
      retry: false,
    }),
  );

  if (isLoading || (user && session.isPending))
    return <Skeleton className="h-[420px] w-full max-w-md" />;

  const isAdmin = session.data?.roles.includes(AppRole.ADMIN) ?? false;

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <section className="bg-background w-full max-w-md rounded-lg border p-6 shadow-lg sm:p-8">
        <span className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-md">
          <KeyRound className="size-5" />
        </span>
        <p className="text-primary mt-6 text-xs font-semibold uppercase">
          {brandConfig.name}
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Administration sign in</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Authentication uses Authorization Code with PKCE. Administrator access
          is resolved from the application database, not from editable browser
          state.
        </p>

        {!user && (
          <Button className="mt-7 w-full" onClick={() => void login("/admin/")}>
            <LogIn />
            Continue with OpenID Connect
          </Button>
        )}

        {user && isAdmin && (
          <div className="mt-7">
            <div className="bg-primary/8 border-primary/20 flex items-center gap-3 rounded-md border p-3 text-sm">
              <ShieldCheck className="text-primary size-4" />
              Administrator access verified
            </div>
            <Button asChild className="mt-4 w-full">
              <Link href="/admin/">
                Open administration
                <ArrowRight />
              </Link>
            </Button>
          </div>
        )}

        {user && !isAdmin && (
          <div className="border-destructive/30 bg-destructive/5 mt-7 rounded-md border p-4 text-sm">
            This identity is valid but does not have the administrator role.
          </div>
        )}
      </section>
    </main>
  );
}
