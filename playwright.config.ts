import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 4175);
const basePath = process.env.E2E_BASE_PATH ?? "/frontend-performance-lab/";
const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
const baseURL = `http://127.0.0.1:${port}${normalizedBasePath}`;
const manageWebServer = !process.env.PLAYWRIGHT_SKIP_WEB_SERVER;

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: {
    timeout: 15_000
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: manageWebServer
    ? {
        command: `node scripts/serve-site.mjs --port ${port} --base ${normalizedBasePath} --shutdown-on-stdin-close true`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000
      }
    : undefined
});
