import { expect, test } from "@playwright/test";
import { openSection, runBenchmarkScenario } from "./support";

const apps = [
  {
    section: "slow",
    panel: "slow-benchmark-panel",
    labels: {
      initial: /slow initial render reset/i,
      search: /slow enterprise search/i,
      table: /slow full table scroll/i,
      chart: /slow chart toggle/i,
      gallery: /slow gallery toggle/i
    }
  },
  {
    section: "optimized",
    panel: "optimized-benchmark-panel",
    labels: {
      initial: /optimized initial render reset/i,
      search: /optimized enterprise search/i,
      table: /optimized virtual table scroll/i,
      chart: /optimized lazy chart toggle/i,
      gallery: /optimized gallery toggle/i
    }
  }
];

for (const app of apps) {
  test.describe(`${app.section} benchmark panel`, () => {
    test.beforeEach(async ({ page }) => {
      await openSection(page, app.section);
    });

    test("runs deterministic scenario controls and reset", async ({ page }) => {
      await runBenchmarkScenario(page, /initial render/i, app.labels.initial);
      await runBenchmarkScenario(page, /search\/filter/i, app.labels.search);
      await expect(page.getByRole("searchbox", { name: /search/i })).toHaveValue("enterprise");
      await runBenchmarkScenario(page, /search\/filter/i, app.labels.search);
      await expect(page.getByRole("searchbox", { name: /search/i })).toHaveValue("Enterprise");

      const tableScroll = page.locator(`[data-table-scroll="${app.section}"]`);
      await runBenchmarkScenario(page, /large table scroll/i, app.labels.table);
      await expect.poll(() => tableScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      await runBenchmarkScenario(page, /large table scroll/i, app.labels.table);
      await expect.poll(() => tableScroll.evaluate((element) => element.scrollTop)).toBe(0);

      await runBenchmarkScenario(page, /heavy chart toggle/i, app.labels.chart);
      await runBenchmarkScenario(page, /image gallery toggle/i, app.labels.gallery);

      await page.getByTestId(app.panel).getByRole("button", { name: /reset/i }).click();
      await expect(page.getByText(/no interaction measured/i)).toBeVisible();
    });
  });
}
