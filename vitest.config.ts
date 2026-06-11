import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    pool: "threads",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["slow-app/src/**/*.test.tsx", "optimized-app/src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "site/coverage",
      include: [
        "benchmark/src/**/*.ts",
        "slow-app/src/**/*.{ts,tsx}",
        "optimized-app/src/**/*.{ts,tsx}"
      ],
      exclude: [
        "**/*.test.tsx",
        "**/main.tsx",
        "**/*.config.ts"
      ]
    }
  }
});
