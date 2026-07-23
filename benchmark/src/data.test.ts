import { describe, expect, it } from "vitest";
import {
  buildRevenueChartSeries,
  calculateSummary,
  createGalleryImages,
  filterAndSortRows,
  formatCurrency,
  formatPercent,
  generatePortfolioRows
} from "./data";
import type { FilterState } from "./data";

describe("benchmark data utilities", () => {
  it("generates deterministic portfolio rows", () => {
    const firstRun = generatePortfolioRows(6);
    const secondRun = generatePortfolioRows(6);

    expect(firstRun).toHaveLength(6);
    expect(secondRun[0]).toEqual(firstRun[0]);
    expect(firstRun[0].id).toBe("acct-1");
    expect(firstRun[0].logoUrl).toContain("data:image/svg+xml");
  });

  it("filters and sorts rows using the shared benchmark filters", () => {
    const rows = generatePortfolioRows(80);
    const filters: FilterState = {
      query: "enterprise",
      region: "North America",
      tier: "Enterprise",
      sortKey: "riskScore",
      sortDirection: "desc"
    };

    const result = filterAndSortRows(rows, filters);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((row) => row.region === "North America")).toBe(true);
    expect(result.every((row) => row.tier === "Enterprise")).toBe(true);
    expect(result[0].riskScore).toBeGreaterThanOrEqual(result.at(-1)?.riskScore ?? 0);
  });

  it("calculates empty and populated summaries", () => {
    expect(calculateSummary([])).toEqual({
      visibleAccounts: 0,
      annualRecurringRevenue: 0,
      averageConversionRate: 0,
      averageLatencyMs: 0,
      criticalAccounts: 0,
      weightedRiskScore: 0
    });

    const rows = generatePortfolioRows(10);
    const summary = calculateSummary(rows);

    expect(summary.visibleAccounts).toBe(10);
    expect(summary.annualRecurringRevenue).toBeGreaterThan(0);
    expect(summary.averageLatencyMs).toBeGreaterThan(0);

    const zeroValueRows = rows.map((row) => ({ ...row, annualContractValue: 0 }));
    expect(calculateSummary(zeroValueRows).weightedRiskScore).toBe(0);
  });

  it("builds the shared deterministic revenue chart series", () => {
    const rows = generatePortfolioRows(40);
    const series = buildRevenueChartSeries(rows);

    expect(series.map((bucket) => bucket.label)).toEqual(["Healthy", "Watch", "Critical"]);
    expect(series.every((bucket) => Number.isFinite(bucket.value))).toBe(true);
    expect(series.every((bucket) => bucket.percent >= 4 && bucket.percent <= 100)).toBe(true);
    expect(buildRevenueChartSeries(rows)).toEqual(series);
  });

  it("creates deterministic gallery assets and display formatters", () => {
    const images = createGalleryImages(3);

    expect(images.map((image) => image.id)).toEqual(["gallery-1", "gallery-2", "gallery-3"]);
    expect(images[0].src).toContain("data:image/svg+xml");
    expect(formatCurrency(1_250_000)).toContain("$");
    expect(formatPercent(0.123)).toBe("12.3%");
  });
});
