import { nitroPreset } from "@acme/env";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5000,
    cors: {
      origin: "*",
    },
  },
  plugins: [nitro(), tanstackStart(), viteReact(), tailwindcss()],
  // SST TanStack Start + AWS: https://sst.dev/docs/start/aws/tanstack/
  nitro: {
    preset: nitroPreset(),
    awsLambda: {
      streaming: true,
    },
  },
});
