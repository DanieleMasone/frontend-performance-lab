import { expect, test } from "@playwright/test";
import { openSection, tabUntilFocused } from "./support";

const apps = [
  { section: "slow", tableName: undefined },
  { section: "optimized", tableName: /account portfolio/i }
];

for (const app of apps) {
  test.describe(`${app.section} accessibility smoke`, () => {
    test.beforeEach(async ({ page }) => {
      await openSection(page, app.section);
    });

    test("important regions and controls have accessible structure", async ({ page }) => {
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByLabel("Dashboard controls")).toBeVisible();
      await expect(page.getByRole("searchbox", { name: /search/i })).toBeVisible();
      await expect(page.getByLabel("Region")).toBeVisible();
      await expect(page.getByLabel("Tier")).toBeVisible();
      await expect(page.getByRole("button", { name: /dark mode/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /search\/filter/i })).toBeVisible();

      if (app.tableName) {
        await expect(page.getByRole("table", { name: app.tableName })).toHaveAttribute("aria-rowcount", /\d+/);
      } else {
        await expect(page.getByRole("table")).toBeVisible();
      }
    });

    test("keyboard navigation reaches controls and benchmark actions", async ({ page }) => {
      await tabUntilFocused(page, page.getByRole("searchbox", { name: /search/i }));
      await tabUntilFocused(page, page.getByRole("button", { name: /dark mode/i }));
      await tabUntilFocused(page, page.getByRole("button", { name: /show chart/i }));
      await tabUntilFocused(page, page.getByRole("button", { name: /search\/filter/i }), 24);
    });
  });
}
