"use client";

import type { Permission } from "@acme/auth/authorization";
import { hasPermission } from "@acme/auth/authorization";
import { Alert } from "@acme/ui/alert";
import { Button } from "@acme/ui/button";
import { Skeleton } from "@acme/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { LogIn, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "~/auth/provider";
import { useTRPC } from "~/trpc/react";

export function AccessBoundary(props: {
  children: React.ReactNode;
  permission?: Permission;
  title: string;
}) {
  const pathname = usePathname();
  const { isLoading, login, user } = useAuth();
  const trpc = useTRPC();
  const session = useQuery(
    trpc.auth.me.queryOptions(undefined, {
      enabled: Boolean(user),
      retry: false,
    }),
  );

  if (isLoading || (user && session.isPending)) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!user) {
    return (
      <section className="bg-background mx-auto max-w-lg rounded-lg border p-6 shadow-xs sm:p-8">
        <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-md">
          <ShieldCheck className="size-5" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">{props.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Sign in through the configured OpenID Connect provider. Access is
          granted from application-owned roles after your identity is verified.
        </p>
        <Button className="mt-6 w-full" onClick={() => void login(pathname)}>
          <LogIn />
          Sign in to continue
        </Button>
      </section>
    );
  }

  if (session.isError) {
    return (
      <Alert variant="destructive">
        The authenticated session could not be verified. Sign out and try again.
      </Alert>
    );
  }

  if (
    props.permission &&
    (!session.data || !hasPermission(session.data.roles, props.permission))
  ) {
    return (
      <section className="bg-background mx-auto max-w-lg rounded-lg border p-6 shadow-xs sm:p-8">
        <span className="bg-destructive/10 text-destructive flex size-11 items-center justify-center rounded-md">
          <ShieldAlert className="size-5" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">Access restricted</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Your account is signed in but does not have permission to open{" "}
          {props.title.toLowerCase()}. Ask an administrator to update your
          application role.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/">Return to dashboard</Link>
        </Button>
      </section>
    );
  }

  return props.children;
}
