import { expect, test } from "@playwright/test";
import { openSection } from "./support";

for (const section of ["slow", "optimized"]) {
  test.describe(`${section} theme persistence`, () => {
    test("dark mode toggle persists across reloads", async ({ page }) => {
      await openSection(page, section);

      await page.getByRole("button", { name: /dark mode/i }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.getByRole("button", { name: /light mode/i })).toHaveAttribute("aria-pressed", "true");

      await page.reload();

      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.getByRole("button", { name: /light mode/i })).toBeVisible();
    });
  });
}
