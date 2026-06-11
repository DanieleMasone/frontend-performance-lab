import { lazy, Profiler, Suspense, useCallback, useMemo, useRef, useState } from "react";
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
import { useDebouncedValue } from "../../benchmark/src/useDebouncedValue";
import { usePersistentTheme } from "../../benchmark/src/usePersistentTheme";
import { BenchmarkPanel } from "./components/BenchmarkPanel";
import { ControlPanel } from "./components/ControlPanel";
import { ImageGallery } from "./components/ImageGallery";
import { KpiStrip } from "./components/KpiStrip";
import { VirtualizedDataTable } from "./components/VirtualizedDataTable";

const HeavyRevenueChart = lazy(() => import("./components/HeavyRevenueChart"));
const TEST_ROW_COUNT = 160;
const ROW_COUNT = import.meta.env.MODE === "test" ? TEST_ROW_COUNT : DATASET_SIZE;

function scrollBenchmarkTable(selector: string) {
  const table = document.querySelector<HTMLElement>(selector);
  table?.scrollTo?.({ top: 9_000, behavior: "auto" });
}

export default function App() {
  const [rows, setRows] = useState(() => generatePortfolioRows(ROW_COUNT));
  const [queryInput, setQueryInput] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [tier, setTier] = useState<AccountTier | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showChart, setShowChart] = useState(false);
  const [showGallery, setShowGallery] = useState(true);
  const [visibleRowCount, setVisibleRowCount] = useState(0);
  const [samples, setSamples] = useState<ProfilerSample[]>([]);
  const [interactions, setInteractions] = useState<InteractionMeasure[]>([]);
  const samplesRef = useRef<ProfilerSample[]>([]);
  const lastPublishRef = useRef(0);
  const suppressNextPublishRef = useRef(false);
  const { theme, toggleTheme } = usePersistentTheme();
  const debouncedQuery = useDebouncedValue(queryInput, 160);

  const appliedFilters = useMemo<FilterState>(
    () => ({
      query: debouncedQuery,
      region,
      tier,
      sortKey,
      sortDirection
    }),
    [debouncedQuery, region, sortDirection, sortKey, tier]
  );

  const controlFilters = useMemo<FilterState>(
    () => ({
      ...appliedFilters,
      query: queryInput
    }),
    [appliedFilters, queryInput]
  );

  const filteredRows = useMemo(() => filterAndSortRows(rows, appliedFilters), [appliedFilters, rows]);
  const summary = useMemo(() => calculateSummary(filteredRows), [filteredRows]);
  const galleryImages = useMemo(() => createGalleryImages(12), []);

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

  const recordInteraction = useCallback((scenario: BenchmarkScenarioId, label: string, action: () => void) => {
    const { measure } = measureInteraction(scenario, label, action);
    setInteractions((current) => [...current.slice(-7), measure]);
  }, []);

  const runScenario = useCallback(
    (scenario: BenchmarkScenarioId) => {
      if (scenario === "initial-render") {
        recordInteraction(scenario, "Optimized initial render reset", () => setRows(generatePortfolioRows(ROW_COUNT)));
        return;
      }

      if (scenario === "search-filter") {
        recordInteraction(scenario, "Optimized enterprise search", () => setQueryInput("enterprise"));
        return;
      }

      if (scenario === "table-scroll") {
        recordInteraction(scenario, "Optimized virtual table scroll", () =>
          scrollBenchmarkTable('[data-table-scroll="optimized"]')
        );
        return;
      }

      if (scenario === "chart-toggle") {
        recordInteraction(scenario, "Optimized lazy chart toggle", () => setShowChart((current) => !current));
        return;
      }

      recordInteraction(scenario, "Optimized gallery toggle", () => setShowGallery((current) => !current));
    },
    [recordInteraction]
  );

  const resetMetrics = useCallback(() => {
    samplesRef.current = [];
    lastPublishRef.current = 0;
    suppressNextPublishRef.current = false;
    setSamples([]);
    setInteractions([]);
    performance.clearMarks();
    performance.clearMeasures();
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => recordInteraction("search-filter", "Optimized search input", () => setQueryInput(value)),
    [recordInteraction]
  );

  const handleRegionChange = useCallback(
    (value: Region | "all") => recordInteraction("search-filter", "Optimized region filter", () => setRegion(value)),
    [recordInteraction]
  );

  const handleTierChange = useCallback(
    (value: AccountTier | "all") => recordInteraction("search-filter", "Optimized tier filter", () => setTier(value)),
    [recordInteraction]
  );

  const handleSortKeyChange = useCallback(
    (value: SortKey) => recordInteraction("search-filter", "Optimized sort change", () => setSortKey(value)),
    [recordInteraction]
  );

  const handleSortDirectionChange = useCallback(
    (value: SortDirection) =>
      recordInteraction("search-filter", "Optimized sort direction", () => setSortDirection(value)),
    [recordInteraction]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Frontend Performance Lab</p>
          <h1>Optimized implementation</h1>
        </div>
        <div className="header-meta" aria-label="Implementation traits">
          <span>Virtualized table</span>
          <span>Lazy chart</span>
          <span>Lazy images</span>
        </div>
      </header>

      <ControlPanel
        filters={controlFilters}
        appliedQuery={debouncedQuery}
        theme={theme}
        onQueryChange={handleQueryChange}
        onRegionChange={handleRegionChange}
        onTierChange={handleTierChange}
        onSortKeyChange={handleSortKeyChange}
        onSortDirectionChange={handleSortDirectionChange}
        onThemeToggle={toggleTheme}
      />

      <div className="workspace">
        <Profiler id="OptimizedApp" onRender={onProfilerRender}>
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
            {showChart ? (
              <Suspense fallback={<div className="panel loading-panel">Loading chart module</div>}>
                <HeavyRevenueChart rows={filteredRows} />
              </Suspense>
            ) : null}
            {showGallery ? <ImageGallery images={galleryImages} /> : null}
            <VirtualizedDataTable rows={filteredRows} onVisibleRowsChange={setVisibleRowCount} />
          </main>
        </Profiler>

        <BenchmarkPanel
          samples={samples}
          interactions={interactions}
          rowCount={filteredRows.length}
          renderedRows={visibleRowCount}
          onRunScenario={runScenario}
          onReset={resetMetrics}
        />
      </div>
    </div>
  );
}
