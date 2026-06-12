import { expect, test } from "@playwright/test";
import {
  expectAppShell,
  metricValue,
  openSection,
  parseMetricNumber,
  runBenchmarkScenario
} from "./support";

test.describe("Optimized app production flow", () => {
  test.beforeEach(async ({ page }) => {
    await openSection(page, "optimized");
  });

  test("app shell and benchmark panel load", async ({ page }) => {
    await expectAppShell(page, /optimized implementation/i, "optimized-benchmark-panel");
    await expect(page.getByLabel("Implementation traits")).toContainText("Virtualized table");
    await expect(page.getByRole("button", { name: /large table scroll/i })).toBeVisible();
  });

  test("search and filter interactions match the slow app controls", async ({ page }) => {
    const search = page.getByRole("searchbox", { name: /search/i });

    await search.fill("enterprise");
    await expect(search).toHaveValue("enterprise");
    await expect(page.getByText(/optimized search input/i)).toBeVisible();

    await page.getByLabel("Region").selectOption("North America");
    await page.getByLabel("Tier").selectOption("Enterprise");
    await expect(page.getByLabel("Region")).toHaveValue("North America");
    await expect(page.getByLabel("Tier")).toHaveValue("Enterprise");
  });

  test("keeps the large dataset virtualized", async ({ page }) => {
    const dataRows = parseMetricNumber(await metricValue(page, "Data rows"));
    const domRows = parseMetricNumber(await metricValue(page, "Rows in DOM"));
    const renderedRows = await page.getByTestId("optimized-row").count();

    await expect(page.getByRole("table", { name: /account portfolio/i })).toHaveAttribute(
      "aria-rowcount",
      String(dataRows)
    );
    expect(dataRows).toBeGreaterThan(1_000);
    expect(domRows).toBeLessThan(dataRows);
    expect(renderedRows).toBeLessThan(60);
  });

  test("lazy chart interaction works", async ({ page }) => {
    await expect(page.getByTestId("optimized-heavy-chart")).toBeHidden();
    await page.getByRole("button", { name: /show chart/i }).click();
    await expect(page.getByTestId("optimized-heavy-chart")).toBeVisible();
    await expect(page.getByRole("img", { name: /revenue by account health/i })).toBeVisible();
  });

  test("benchmark metrics update after virtual table scroll scenario", async ({ page }) => {
    await runBenchmarkScenario(page, /large table scroll/i, /optimized virtual table scroll/i);
  });
});
