import { expect, type Locator, type Page } from "@playwright/test";

const e2eRowCount = process.env.E2E_ROW_COUNT ?? "1200";

export async function openSection(page: Page, section = "") {
  await page.goto(section ? `./${section}/?rows=${e2eRowCount}` : "./");
}

export async function metricValue(page: Page, label: string) {
  const metric = page.locator(".metric-grid div").filter({ has: page.locator("dt", { hasText: label }) });
  return metric.locator("dd").innerText();
}

export function parseMetricNumber(value: string) {
  return Number(value.replace(/,/g, ""));
}

export async function expectAppShell(page: Page, heading: RegExp, panelTestId: string) {
  await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: /search/i })).toBeVisible();
  await expect(page.getByTestId(panelTestId)).toBeVisible();
  await expect(page.getByRole("heading", { name: /account portfolio/i })).toBeVisible();
}

export async function runBenchmarkScenario(page: Page, buttonName: RegExp, interactionLabel: RegExp) {
  await page.getByRole("button", { name: buttonName }).click();
  await expect(page.getByText(interactionLabel)).toBeVisible();
}

export async function tabUntilFocused(page: Page, locator: Locator, maxTabs = 20) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");
    if (await locator.evaluate((element) => document.activeElement === element)) {
      return;
    }
  }

  throw new Error("Expected element to be reachable by keyboard tab navigation.");
}
