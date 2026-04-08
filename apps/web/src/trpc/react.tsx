"use client";

import type { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@acme/trpc/client";
import { TRPC_HTTP_PATH } from "@acme/trpc/client";

import { env } from "~/env";
import { getAccessToken } from "~/lib/client-auth";
import { createQueryClient } from "./query-client";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  return (browserQueryClient ??= createQueryClient());
}

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

/** Base URL (e.g. `http://localhost:5000`) or full batch URL that already includes the tRPC HTTP path. */
function getTrpcBatchHttpUrl(): string {
  const raw = env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, "");
  try {
    const u = new URL(raw);
    const path = u.pathname.replace(/\/+$/, "");
    if (path.endsWith(TRPC_HTTP_PATH)) {
      return `${u.origin}${path}`;
    }
    const base = path ? `${u.origin}${path}` : u.origin;
    return new URL(TRPC_HTTP_PATH, `${base}/`).href.replace(/\/$/, "");
  } catch {
    return new URL(TRPC_HTTP_PATH, "http://localhost:5000/").href.replace(
      /\/$/,
      "",
    );
  }
}

function getNodeEnv(): string {
  return env.NODE_ENV;
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            getNodeEnv() === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getTrpcBatchHttpUrl(),
          headers() {
            const headers = new Headers();
            const token = getAccessToken();
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
