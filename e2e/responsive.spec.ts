import { expect, test, type Page } from "@playwright/test";
import { openSection } from "./support";

const mobileViewport = { width: 390, height: 844 };

async function expectNoDocumentOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth
  }));

  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
}

test.describe("responsive smoke", () => {
  test.use({ viewport: mobileViewport });

  test("published pages avoid global horizontal overflow on mobile", async ({ page }) => {
    await openSection(page);
    await expect(page.getByRole("heading", { name: "Frontend Performance Lab" })).toBeVisible();
    await expectNoDocumentOverflow(page);

    await openSection(page, "docs");
    await expect(page.getByRole("heading", { name: "Documentation" })).toBeVisible();
    await expectNoDocumentOverflow(page);

    await openSection(page, "docs/user-guide");
    await expect(page.getByRole("heading", { name: "User Guide", exact: true })).toBeVisible();
    await expectNoDocumentOverflow(page);

    await openSection(page, "benchmark");
    await expect(page.getByRole("heading", { name: "Benchmark Protocol" })).toBeVisible();
    await expectNoDocumentOverflow(page);

    await openSection(page, "typedoc");
    await expect(page.getByRole("heading", { name: "frontend-performance-lab" })).toBeVisible();
    await expectNoDocumentOverflow(page);

    await openSection(page, "slow");
    await expect(page.getByRole("heading", { name: /slow implementation/i })).toBeVisible();
    await expect(page.getByLabel("Scrollable full account table")).toBeVisible();
    await expectNoDocumentOverflow(page);

    await openSection(page, "optimized");
    await expect(page.getByRole("heading", { name: /optimized implementation/i })).toBeVisible();
    await expect(page.getByRole("table", { name: /account portfolio/i })).toBeVisible();
    await expectNoDocumentOverflow(page);
  });
});
