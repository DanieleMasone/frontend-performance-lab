import { expect, test } from "@playwright/test";
import { openSection } from "./support";

test.describe("Pages navigation", () => {
  test.beforeEach(async ({ page }) => {
    await openSection(page);
  });

  test("root page loads and links to published sections", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Frontend Performance Lab" })).toBeVisible();

    const links = [
      { name: /^slow app\b/i, href: "./slow/" },
      { name: /^optimized app\b/i, href: "./optimized/" },
      { name: /^coverage\b/i, href: "./coverage/" },
      { name: /^typedoc\b/i, href: "./typedoc/" },
      { name: /^documentation\b/i, href: "./docs/" },
      { name: /^results template\b/i, href: "./docs/results-before-after/" },
      { name: /^benchmark protocol\b/i, href: "./benchmark/" }
    ];

    for (const link of links) {
      await expect(page.getByRole("link", { name: link.name })).toHaveAttribute("href", link.href);
    }
  });

  test("root links point to real generated HTML pages", async ({ page }) => {
    const hrefs = (await page.locator("a[href]").evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href"))
        .filter((href) => Boolean(href) && !href?.startsWith("http") && !href?.startsWith("#"))
    )) as string[];

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const target = new URL(href, page.url()).toString();
      const response = await page.request.get(target);
      expect(response.ok(), `${href} should resolve`).toBe(true);
      expect(target.endsWith(".md"), `${href} should not expose raw markdown`).toBe(false);
    }
  });

  test("slow and optimized app routes load from the generated artifact", async ({ page }) => {
    await openSection(page, "slow");
    await expect(page.getByRole("heading", { name: /slow implementation/i })).toBeVisible();

    await openSection(page, "optimized");
    await expect(page.getByRole("heading", { name: /optimized implementation/i })).toBeVisible();
  });
});
