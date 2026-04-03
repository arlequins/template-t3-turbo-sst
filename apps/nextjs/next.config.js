import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await jiti.import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  /** Static HTML export for S3 + CloudFront (no OpenNext / Node server in AWS for this app) */
  output: "export",

  poweredByHeader: false,

  transpilePackages: ["@acme/api", "@acme/ui", "@acme/validators"],

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },
};

export default config;
