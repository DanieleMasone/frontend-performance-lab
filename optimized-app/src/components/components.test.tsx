import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  calculateSummary,
  createGalleryImages,
  generatePortfolioRows
} from "../../../benchmark/src/data";
import type { FilterState } from "../../../benchmark/src/data";
import type { ProfilerSample } from "../../../benchmark/src/profiling";
import { BenchmarkPanel } from "./BenchmarkPanel";
import { ControlPanel } from "./ControlPanel";
import HeavyRevenueChart from "./HeavyRevenueChart";
import { ImageGallery } from "./ImageGallery";
import { KpiStrip } from "./KpiStrip";
import { VirtualizedDataTable } from "./VirtualizedDataTable";

const filters: FilterState = {
  query: "",
  region: "all",
  tier: "all",
  sortKey: "riskScore",
  sortDirection: "desc"
};

describe("optimized app components", () => {
  it("wires controls and exposes the applied debounced query", async () => {
    const user = userEvent.setup();
    const handlers = {
      onQueryChange: vi.fn(),
      onRegionChange: vi.fn(),
      onTierChange: vi.fn(),
      onSortKeyChange: vi.fn(),
      onSortDirectionChange: vi.fn(),
      onThemeToggle: vi.fn()
    };

    render(<ControlPanel filters={filters} appliedQuery="enterprise" theme="dark" {...handlers} />);

    await user.type(screen.getByRole("searchbox", { name: /search/i }), "z");
    await user.click(screen.getByRole("button", { name: /light mode/i }));

    expect(screen.getByText(/applied search query: enterprise/i)).toBeTruthy();
    expect(handlers.onQueryChange).toHaveBeenCalledWith("z");
    expect(handlers.onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it("displays optimized benchmark metrics and scenario actions", async () => {
    const user = userEvent.setup();
    const onRunScenario = vi.fn();
    const onReset = vi.fn();
    const samples: ProfilerSample[] = [
      {
        id: "OptimizedApp",
        phase: "update",
        actualDuration: 5,
        baseDuration: 8,
        startTime: 1,
        commitTime: 2
      }
    ];

    render(
      <BenchmarkPanel
        samples={samples}
        interactions={[
          {
            scenario: "table-scroll",
            label: "Optimized virtual table scroll",
            duration: 1.2,
            startedAt: 1
          }
        ]}
        rowCount={200}
        renderedRows={28}
        onRunScenario={onRunScenario}
        onReset={onReset}
      />
    );

    const panel = screen.getByTestId("optimized-benchmark-panel");
    expect(within(panel).getByText("Optimized virtual table scroll: 1.2 ms")).toBeTruthy();
    expect(within(panel).getByText("28")).toBeTruthy();

    await user.click(within(panel).getByRole("button", { name: /large table scroll/i }));
    await user.click(within(panel).getByRole("button", { name: /reset/i }));

    expect(onRunScenario).toHaveBeenCalledWith("table-scroll");
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("renders a virtualized table window and supports local row selection", async () => {
    const user = userEvent.setup();
    const rows = generatePortfolioRows(120);
    const onVisibleRowsChange = vi.fn();

    render(<VirtualizedDataTable rows={rows} onVisibleRowsChange={onVisibleRowsChange} />);

    await waitFor(() => {
      expect(onVisibleRowsChange).toHaveBeenCalledWith(expect.any(Number));
    });

    const table = screen.getByRole("table", { name: /account portfolio/i });
    const renderedRows = screen.getAllByTestId("optimized-row");
    expect(table.getAttribute("aria-rowcount")).toBe("120");
    expect(renderedRows.length).toBeLessThan(40);

    await user.click(renderedRows[0]);
    expect(renderedRows[0].getAttribute("aria-selected")).toBe("true");
  });

  it("supports keyboard paging on the virtual table", () => {
    render(<VirtualizedDataTable rows={generatePortfolioRows(120)} onVisibleRowsChange={vi.fn()} />);

    const scrollRegion = document.querySelector<HTMLElement>('[data-table-scroll="optimized"]');
    expect(scrollRegion).toBeTruthy();

    fireEvent.keyDown(scrollRegion as HTMLElement, { key: "End" });
    expect(scrollRegion?.scrollTop).toBeGreaterThan(0);
  });

  it("renders optimized chart, lazy gallery assets, and KPI summaries", () => {
    const rows = generatePortfolioRows(8);
    const images = createGalleryImages(2);

    render(
      <>
        <KpiStrip summary={calculateSummary(rows)} />
        <HeavyRevenueChart rows={rows} />
        <ImageGallery images={images} />
      </>
    );

    expect(screen.getByLabelText("Portfolio summary")).toBeTruthy();
    expect(screen.getByTestId("optimized-heavy-chart")).toBeTruthy();
    expect(screen.getByRole("img", { name: /revenue by account health/i })).toBeTruthy();
    expect(screen.getAllByRole("img", { name: /synthetic benchmark capture/i })).toHaveLength(2);
    expect(screen.getAllByRole("img", { name: /synthetic benchmark capture/i })[0].getAttribute("loading")).toBe(
      "lazy"
    );
  });
});
