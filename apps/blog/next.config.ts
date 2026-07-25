import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",
  poweredByHeader: false,
  trailingSlash: true,
  transpilePackages: ["@acme/ui"],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default config;
