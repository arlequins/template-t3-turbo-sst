"use client";

import { Button } from "@acme/ui/button";
import { Skeleton } from "@acme/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FilePenLine,
  KeyRound,
  Languages,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { brandConfig } from "~/config/brand.config";
import { useTRPC } from "~/trpc/react";

function Metric(props: { label: string; loading: boolean; value?: number }) {
  return (
    <div className="border-r px-4 py-5 last:border-r-0">
      <p className="text-muted-foreground text-xs font-medium">{props.label}</p>
      {props.loading ? (
        <Skeleton className="mt-2 h-8 w-14" />
      ) : (
        <p className="mt-1 text-2xl font-semibold">{props.value ?? 0}</p>
      )}
    </div>
  );
}

export function AdminSettings() {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.me.queryOptions());
  const all = useQuery(
    trpc.post.all.queryOptions({
      direction: "desc",
      page: 1,
      pageSize: 50,
      query: "",
      sort: "createdAt",
    }),
  );
  const drafts = useQuery(
    trpc.post.all.queryOptions({
      direction: "desc",
      page: 1,
      pageSize: 1,
      query: "",
      sort: "createdAt",
      status: "draft",
    }),
  );
  const reviews = useQuery(
    trpc.post.all.queryOptions({
      direction: "desc",
      page: 1,
      pageSize: 1,
      query: "",
      sort: "createdAt",
      status: "in-review",
    }),
  );
  const approved = useQuery(
    trpc.post.all.queryOptions({
      direction: "desc",
      page: 1,
      pageSize: 1,
      query: "",
      sort: "createdAt",
      status: "approved",
    }),
  );

  const incompleteTranslations = useMemo(() => {
    const localeSets = new Map<string, Set<string>>();
    for (const item of all.data?.items ?? []) {
      const locales = localeSets.get(item.translationKey) ?? new Set<string>();
      locales.add(item.locale);
      localeSets.set(item.translationKey, locales);
    }
    return [...localeSets.values()].filter((locales) => locales.size < 3)
      .length;
  }, [all.data]);

  const loading =
    all.isPending ||
    drafts.isPending ||
    reviews.isPending ||
    approved.isPending;

  return (
    <div className="space-y-5">
      <section className="bg-background overflow-hidden rounded-lg border shadow-xs">
        <div className="border-b p-5 sm:p-6">
          <p className="text-primary text-xs font-semibold uppercase">
            Editorial operations
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{brandConfig.name}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Review content health before publishing the static theme.
              </p>
            </div>
            <Button asChild>
              <Link href="/editor/">
                <FilePenLine />
                Create content
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4">
          <Metric
            label="All content"
            loading={loading}
            value={all.data?.total}
          />
          <Metric label="Draft" loading={loading} value={drafts.data?.total} />
          <Metric
            label="In review"
            loading={loading}
            value={reviews.data?.total}
          />
          <Metric
            label="Approved"
            loading={loading}
            value={approved.data?.total}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="bg-background rounded-lg border p-5 shadow-xs sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-md">
              <Languages className="size-5" />
            </span>
            <span
              className={
                incompleteTranslations === 0
                  ? "text-primary text-sm font-medium"
                  : "text-amber-700 text-sm font-medium dark:text-amber-300"
              }
            >
              {incompleteTranslations === 0
                ? "Coverage complete"
                : `${incompleteTranslations} incomplete groups`}
            </span>
          </div>
          <h2 className="mt-5 font-semibold">Translation coverage</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Every translation key should have English, Japanese, and Korean
            content before static publication.
          </p>
          <Button asChild className="mt-5" variant="outline">
            <Link href="/posts/">
              Review content
              <ArrowRight />
            </Link>
          </Button>
        </section>

        <section className="bg-background rounded-lg border p-5 shadow-xs sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-md">
              <ShieldCheck className="size-5" />
            </span>
            <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
              OIDC + PKCE
            </span>
          </div>
          <h2 className="mt-5 font-semibold">Administrator session</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {session.data?.name ?? session.data?.email ?? "Authenticated user"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {session.data?.roles.map((role) => (
              <span
                className="bg-muted rounded-md px-2 py-1 text-xs font-medium"
                key={role}
              >
                {role}
              </span>
            ))}
          </div>
          <Button asChild className="mt-5" variant="outline">
            <Link href="/users/">
              <Users />
              Manage access
            </Link>
          </Button>
        </section>
      </div>

      <section className="bg-background rounded-lg border p-5 shadow-xs sm:p-6">
        <h2 className="font-semibold">Release readiness</h2>
        <div className="mt-4 divide-y">
          <div className="flex items-start gap-3 py-3">
            {incompleteTranslations === 0 ? (
              <CheckCircle2 className="text-primary mt-0.5 size-4" />
            ) : (
              <CircleAlert className="mt-0.5 size-4 text-amber-600" />
            )}
            <div>
              <p className="text-sm font-medium">Localized content</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Translation groups are checked from stored content metadata.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-3">
            <KeyRound className="text-primary mt-0.5 size-4" />
            <div>
              <p className="text-sm font-medium">Authentication boundary</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Administration and user management require the application
                administrator role.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
