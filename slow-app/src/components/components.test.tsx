import { fireEvent, render, screen, within } from "@testing-library/react";
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
import { SlowDataTable } from "./SlowDataTable";

const filters: FilterState = {
  query: "",
  region: "all",
  tier: "all",
  sortKey: "riskScore",
  sortDirection: "desc"
};

describe("slow app components", () => {
  it("wires dashboard controls to callbacks", async () => {
    const user = userEvent.setup();
    const handlers = {
      onQueryChange: vi.fn(),
      onRegionChange: vi.fn(),
      onTierChange: vi.fn(),
      onSortKeyChange: vi.fn(),
      onSortDirectionChange: vi.fn(),
      onThemeToggle: vi.fn()
    };

    render(<ControlPanel filters={filters} theme="light" {...handlers} />);

    fireEvent.change(screen.getByRole("searchbox", { name: /search/i }), { target: { value: "ac" } });
    await user.selectOptions(screen.getByLabelText("Region"), "EMEA");
    await user.selectOptions(screen.getByLabelText("Tier"), "Enterprise");
    await user.selectOptions(screen.getByLabelText("Sort"), "Latency");
    await user.selectOptions(screen.getByLabelText("Order"), "asc");
    await user.click(screen.getByRole("button", { name: /dark mode/i }));

    expect(handlers.onQueryChange).toHaveBeenLastCalledWith("ac");
    expect(handlers.onRegionChange).toHaveBeenCalledWith("EMEA");
    expect(handlers.onTierChange).toHaveBeenCalledWith("Enterprise");
    expect(handlers.onSortKeyChange).toHaveBeenCalledWith("latencyMs");
    expect(handlers.onSortDirectionChange).toHaveBeenCalledWith("asc");
    expect(handlers.onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it("displays render and interaction metrics in the benchmark panel", async () => {
    const user = userEvent.setup();
    const onRunScenario = vi.fn();
    const onReset = vi.fn();
    const samples: ProfilerSample[] = [
      {
        id: "SlowApp",
        phase: "mount",
        actualDuration: 12,
        baseDuration: 20,
        startTime: 1,
        commitTime: 2
      }
    ];

    render(
      <BenchmarkPanel
        samples={samples}
        interactions={[
          {
            scenario: "search-filter",
            label: "Slow search input",
            duration: 3.4,
            startedAt: 1
          }
        ]}
        rowCount={120}
        renderedRows={120}
        onRunScenario={onRunScenario}
        onReset={onReset}
      />
    );

    const panel = screen.getByTestId("slow-benchmark-panel");
    expect(within(panel).getByText("Slow search input: 3.4 ms")).toBeTruthy();
    expect(within(panel).getAllByText("120").length).toBeGreaterThan(1);

    await user.click(within(panel).getByRole("button", { name: /heavy chart toggle/i }));
    await user.click(within(panel).getByRole("button", { name: /reset/i }));

    expect(onRunScenario).toHaveBeenCalledWith("chart-toggle");
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("renders the full table with eager row images and selectable rows", async () => {
    const user = userEvent.setup();
    const rows = generatePortfolioRows(3);
    const onRowToggle = vi.fn();

    render(<SlowDataTable rows={rows} selectedRowIds={[rows[0].id]} onRowToggle={onRowToggle} />);

    const renderedRows = screen.getAllByTestId("slow-row");
    expect(renderedRows).toHaveLength(3);
    expect(renderedRows[0].getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector("tbody img")?.getAttribute("loading")).toBe("eager");

    await user.click(renderedRows[1]);
    expect(onRowToggle).toHaveBeenCalledWith(rows[1].id);
  });

  it("renders slow chart, gallery, and KPI summaries", () => {
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
    expect(screen.getByTestId("slow-heavy-chart")).toBeTruthy();
    expect(screen.getByRole("img", { name: /revenue by account health/i })).toBeTruthy();
    expect(screen.getAllByRole("img", { name: /synthetic benchmark capture/i })).toHaveLength(2);
    expect(screen.getAllByRole("img", { name: /synthetic benchmark capture/i })[0].getAttribute("decoding")).toBe(
      "sync"
    );
  });
});
