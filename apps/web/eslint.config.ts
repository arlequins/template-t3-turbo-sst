import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@acme/eslint-config/base";
import { nextjsConfig } from "@acme/eslint-config/nextjs";
import { reactConfig } from "@acme/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**", "sst-env.d.ts"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
