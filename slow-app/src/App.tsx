import { Profiler, useCallback, useRef, useState } from "react";
import type { ProfilerOnRenderCallback } from "react";
import {
  DATASET_SIZE,
  calculateSummary,
  createGalleryImages,
  filterAndSortRows,
  generatePortfolioRows
} from "../../benchmark/src/data";
import type {
  AccountTier,
  FilterState,
  Region,
  SortDirection,
  SortKey
} from "../../benchmark/src/data";
import type {
  BenchmarkScenarioId,
  InteractionMeasure,
  ProfilerSample
} from "../../benchmark/src/profiling";
import { measureInteraction, toProfilerSample } from "../../benchmark/src/profiling";
import { usePersistentTheme } from "../../benchmark/src/usePersistentTheme";
import { BenchmarkPanel } from "./components/BenchmarkPanel";
import { ControlPanel } from "./components/ControlPanel";
import HeavyRevenueChart from "./components/HeavyRevenueChart";
import { ImageGallery } from "./components/ImageGallery";
import { KpiStrip } from "./components/KpiStrip";
import { SlowDataTable } from "./components/SlowDataTable";

const TEST_ROW_COUNT = 160;

function resolveRowCount() {
  if (import.meta.env.MODE === "test") {
    return TEST_ROW_COUNT;
  }

  const requestedRows = Number(new URLSearchParams(window.location.search).get("rows"));
  if (Number.isInteger(requestedRows) && requestedRows >= 100 && requestedRows <= DATASET_SIZE) {
    return requestedRows;
  }

  return DATASET_SIZE;
}

const ROW_COUNT = resolveRowCount();

function scrollBenchmarkTable(selector: string) {
  const table = document.querySelector<HTMLElement>(selector);
  table?.scrollTo?.({ top: 9_000, behavior: "auto" });
}

export default function App() {
  const [rows, setRows] = useState(() => generatePortfolioRows(ROW_COUNT));
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [tier, setTier] = useState<AccountTier | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showChart, setShowChart] = useState(false);
  const [showGallery, setShowGallery] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [samples, setSamples] = useState<ProfilerSample[]>([]);
  const [interactions, setInteractions] = useState<InteractionMeasure[]>([]);
  const samplesRef = useRef<ProfilerSample[]>([]);
  const lastPublishRef = useRef(0);
  const suppressNextPublishRef = useRef(false);
  const { theme, toggleTheme } = usePersistentTheme();

  const filters: FilterState = {
    query,
    region,
    tier,
    sortKey,
    sortDirection
  };

  const filteredRows = filterAndSortRows(rows, filters);
  const summary = calculateSummary(filteredRows);
  const galleryImages = createGalleryImages(12);

  const publishProfilerSample = useCallback((sample: ProfilerSample) => {
    samplesRef.current = [...samplesRef.current.slice(-79), sample];
    const now = performance.now();

    if (suppressNextPublishRef.current) {
      suppressNextPublishRef.current = false;
      return;
    }

    if (samplesRef.current.length === 1 || now - lastPublishRef.current > 500) {
      lastPublishRef.current = now;
      suppressNextPublishRef.current = true;
      setSamples(samplesRef.current);
    }
  }, []);

  const onProfilerRender = useCallback<ProfilerOnRenderCallback>(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      publishProfilerSample(toProfilerSample(id, phase, actualDuration, baseDuration, startTime, commitTime));
    },
    [publishProfilerSample]
  );

  function recordInteraction(scenario: BenchmarkScenarioId, label: string, action: () => void) {
    const { measure } = measureInteraction(scenario, label, action);
    setInteractions((current) => [...current.slice(-7), measure]);
  }

  function runScenario(scenario: BenchmarkScenarioId) {
    if (scenario === "initial-render") {
      recordInteraction(scenario, "Slow initial render reset", () => setRows(generatePortfolioRows(ROW_COUNT)));
      return;
    }

    if (scenario === "search-filter") {
      recordInteraction(scenario, "Slow enterprise search", () => setQuery("enterprise"));
      return;
    }

    if (scenario === "table-scroll") {
      recordInteraction(scenario, "Slow full table scroll", () => scrollBenchmarkTable('[data-table-scroll="slow"]'));
      return;
    }

    if (scenario === "chart-toggle") {
      recordInteraction(scenario, "Slow chart toggle", () => setShowChart((current) => !current));
      return;
    }

    recordInteraction(scenario, "Slow gallery toggle", () => setShowGallery((current) => !current));
  }

  function resetMetrics() {
    samplesRef.current = [];
    lastPublishRef.current = 0;
    suppressNextPublishRef.current = false;
    setSamples([]);
    setInteractions([]);
    performance.clearMarks();
    performance.clearMeasures();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Frontend Performance Lab</p>
          <h1>Slow implementation</h1>
        </div>
        <div className="header-meta" aria-label="Implementation traits">
          <span>Full DOM</span>
          <span>Upfront chart</span>
          <span>Eager images</span>
        </div>
      </header>

      <ControlPanel
        filters={filters}
        theme={theme}
        onQueryChange={(value) => recordInteraction("search-filter", "Slow search input", () => setQuery(value))}
        onRegionChange={(value) => recordInteraction("search-filter", "Slow region filter", () => setRegion(value))}
        onTierChange={(value) => recordInteraction("search-filter", "Slow tier filter", () => setTier(value))}
        onSortKeyChange={(value) => recordInteraction("search-filter", "Slow sort change", () => setSortKey(value))}
        onSortDirectionChange={(value) =>
          recordInteraction("search-filter", "Slow sort direction", () => setSortDirection(value))
        }
        onThemeToggle={toggleTheme}
      />

      <div className="workspace">
        <Profiler id="SlowApp" onRender={onProfilerRender}>
          <main className="main-column">
            <KpiStrip summary={summary} />
            <div className="section-actions" aria-label="Optional sections">
              <button type="button" onClick={() => runScenario("chart-toggle")}>
                {showChart ? "Hide chart" : "Show chart"}
              </button>
              <button type="button" onClick={() => runScenario("gallery-load")}>
                {showGallery ? "Hide gallery" : "Show gallery"}
              </button>
            </div>
            {showChart ? <HeavyRevenueChart rows={filteredRows} /> : null}
            {showGallery ? <ImageGallery images={galleryImages} /> : null}
            <SlowDataTable
              rows={filteredRows}
              selectedRowIds={selectedRowIds}
              onRowToggle={(id) =>
                setSelectedRowIds((current) =>
                  current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
                )
              }
            />
          </main>
        </Profiler>

        <BenchmarkPanel
          samples={samples}
          interactions={interactions}
          rowCount={filteredRows.length}
          renderedRows={filteredRows.length}
          onRunScenario={runScenario}
          onReset={resetMetrics}
        />
      </div>
    </div>
  );
}
