import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/blog-e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3200",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "pnpm --filter @acme/blog-theme dev --port 3200",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://localhost:3200/en/",
  },
});
