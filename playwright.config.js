const { defineConfig, devices } = require("@playwright/test");
const fs = require("fs");
const dotenv = require("dotenv");

// Load base first, then override with local/test-local values.
[".env", ".env.local", ".env.test.local"].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, quiet: true, override: true });
  }
});

const keepArtifacts = process.env.TG_E2E_KEEP_ARTIFACTS === "1";

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: !keepArtifacts ? "off" : "on-first-retry",
    screenshot: !keepArtifacts ? "off" : "only-on-failure",
    video: !keepArtifacts ? "off" : "retain-on-failure",
    acceptDownloads: true,
  },
  webServer: {
    command: "pnpm dev --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.spec\.js/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/auth-state.json",
      },
    },
  ],
});
