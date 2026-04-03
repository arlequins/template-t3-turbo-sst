import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

const fallbackSite = "http://localhost:3000";
const fallbackApiUrl = "http://localhost:5000";

/**
 * Public env vars for the client bundle and build time.
 * For SST `StaticSite` builds: inject via `environment` in `sst.config.ts`, or export in the shell before `sst deploy`.
 */
export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {},
  client: {
    NEXT_PUBLIC_SITE_URL: z.preprocess(
      (v) => (typeof v === "string" && v.length > 0 ? v : fallbackSite),
      z.string().url(),
    ),
    NEXT_PUBLIC_API_URL: z.preprocess(
      (v) => (typeof v === "string" && v.length > 0 ? v : fallbackApiUrl),
      z.string().url(),
    ),
  },
  /*
   * Specify what values should be validated by your schemas above.
   *
   * If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
   * For Next.js >= 13.4.4, you can use the experimental__runtimeEnv option and
   * only specify client-side variables.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
