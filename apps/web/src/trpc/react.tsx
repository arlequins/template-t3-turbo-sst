"use client";

import type { AppRouter } from "@acme/trpc/client";
import { TRPC_HTTP_PATH } from "@acme/trpc/client";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import SuperJSON from "superjson";

import { env } from "~/env";
import { getAccessToken } from "~/lib/client-auth";
import { createQueryClient } from "./query-client";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

/** Batch URL = validated `NEXT_PUBLIC_API_URL` base + `TRPC_HTTP_PATH`. */
function getTrpcBatchHttpUrl(): string {
  const base = env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, "");
  return new URL(TRPC_HTTP_PATH, `${base}/`).href.replace(/\/$/, "");
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
          async headers() {
            const headers = new Headers();
            const token = await getAccessToken();
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
