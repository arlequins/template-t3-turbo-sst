import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { nitroPreset } from "@acme/env";

export default defineConfig({
  server: {
    port: 5000,
    cors: {
      origin: "*",
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    nitro(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
  // SST TanStack Start + AWS: https://sst.dev/docs/start/aws/tanstack/
  nitro: {
    preset: nitroPreset(),
    awsLambda: {
      streaming: true,
    },
  },
});
