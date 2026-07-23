import { expect, test } from "@playwright/test";
import {
  expectAppShell,
  metricValue,
  openSection,
  parseMetricNumber,
  runBenchmarkScenario
} from "./support";

test.describe("Slow app production flow", () => {
  test.beforeEach(async ({ page }) => {
    await openSection(page, "slow");
  });

  test("app shell and benchmark panel load", async ({ page }) => {
    await expectAppShell(page, /slow implementation/i, "slow-benchmark-panel");
    await expect(page.getByLabel("Implementation traits")).toContainText("Full DOM");
    await expect(page.getByRole("button", { name: /large table scroll/i })).toBeVisible();
  });

  test("search and filter interactions update visible behavior and metrics", async ({ page }) => {
    const search = page.getByRole("searchbox", { name: /search/i });

    await search.fill("enterprise");
    await expect(search).toHaveValue("enterprise");
    await expect(page.getByText(/slow search input/i)).toBeVisible();
    await expect(page.getByTestId("slow-row").first()).toContainText(/enterprise/i);
  });

  test("renders a large non-virtualized table", async ({ page }) => {
    const dataRows = parseMetricNumber(await metricValue(page, "Data rows"));
    const domRows = parseMetricNumber(await metricValue(page, "Rows in DOM"));
    const renderedRows = await page.getByTestId("slow-row").count();

    expect(dataRows).toBeGreaterThan(1_000);
    expect(domRows).toBe(dataRows);
    expect(renderedRows).toBe(domRows);
  });

  test("heavy chart and gallery scenarios work", async ({ page }) => {
    await page.getByRole("button", { name: /show chart/i }).click();
    await expect(page.getByTestId("slow-heavy-chart")).toBeVisible();
    await expect(page.getByRole("list", { name: /revenue by account health/i })).toBeVisible();

    await page.getByRole("button", { name: /hide gallery/i }).click();
    await expect(page.getByRole("heading", { name: /scenario captures/i })).toBeHidden();
    await page.getByRole("button", { name: /show gallery/i }).click();
    await expect(page.getByRole("heading", { name: /scenario captures/i })).toBeVisible();
  });

  test("benchmark metrics update after table scroll scenario", async ({ page }) => {
    await runBenchmarkScenario(page, /large table scroll/i, /slow full table scroll/i);
  });
});
