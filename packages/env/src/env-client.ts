import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

import {
  DEFAULT_LOCALHOST_API_URL,
  DEFAULT_LOCALHOST_SITE_URL,
} from "./public-defaults.js";
import { skipEnvValidation } from "./skip-validation.js";

/**
 * Next.js / Vite `NEXT_PUBLIC_*` (browser-inlined at build). Kept separate from {@link serverEnv}.
 * Use for SST `StaticSite.environment`, etc. — not for secrets.
 */
export const clientEnv = createEnv({
  server: {
    NEXT_PUBLIC_SITE_URL: z.preprocess(
      (v) =>
        typeof v === "string" && v.trim().length > 0
          ? v
          : DEFAULT_LOCALHOST_SITE_URL,
      z.url(),
    ),
    NEXT_PUBLIC_API_URL: z.preprocess(
      (v) =>
        typeof v === "string" && v.trim().length > 0
          ? v
          : DEFAULT_LOCALHOST_API_URL,
      z.url(),
    ),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: skipEnvValidation,
});
