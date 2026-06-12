import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    pool: "threads",
    globals: true,
    testTimeout: 15_000,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "benchmark/src/**/*.test.ts",
      "benchmark/src/**/*.test.tsx",
      "slow-app/src/**/*.test.tsx",
      "optimized-app/src/**/*.test.tsx"
    ],
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
        "**/*.test.ts",
        "**/main.tsx",
        "**/*.config.ts"
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 75,
        lines: 80
      }
    }
  }
});
