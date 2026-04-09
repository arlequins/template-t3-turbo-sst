import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@acme/eslint-config/base";
import { reactConfig } from "@acme/eslint-config/react";

export default defineConfig(
  {
    ignores: [".nitro/**", ".output/**", ".tanstack/**", "sst-env.d.ts"],
  },
  baseConfig,
  reactConfig,
  restrictEnvAccess,
);
