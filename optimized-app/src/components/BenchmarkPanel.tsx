import type {
  BenchmarkScenarioId,
  InteractionMeasure,
  ProfilerSample
} from "../../../benchmark/src/profiling";
import {
  BENCHMARK_SCENARIOS,
  formatDuration,
  summarizeProfilerSamples
} from "../../../benchmark/src/profiling";

interface BenchmarkPanelProps {
  samples: readonly ProfilerSample[];
  interactions: readonly InteractionMeasure[];
  rowCount: number;
  renderedRows: number;
  onRunScenario: (scenario: BenchmarkScenarioId) => void;
  onReset: () => void;
}

export function BenchmarkPanel({
  samples,
  interactions,
  rowCount,
  renderedRows,
  onRunScenario,
  onReset
}: BenchmarkPanelProps) {
  const summary = summarizeProfilerSamples(samples);
  const latestInteraction = interactions.at(-1);

  return (
    <aside
      className="panel benchmark-panel"
      data-testid="optimized-benchmark-panel"
      aria-labelledby="optimized-benchmark-title"
    >
      <div className="panel-header">
        <div>
          <p className="eyebrow">Optimized benchmark</p>
          <h2 id="optimized-benchmark-title">Runtime profile</h2>
        </div>
        <button className="ghost-button" type="button" onClick={onReset}>
          Reset
        </button>
      </div>

      <dl className="metric-grid" aria-label="Optimized app render metrics">
        <div>
          <dt>Commits</dt>
          <dd>{summary.commitCount}</dd>
        </div>
        <div>
          <dt>Last render</dt>
          <dd>{formatDuration(summary.lastActualDuration)}</dd>
        </div>
        <div>
          <dt>Average</dt>
          <dd>{formatDuration(summary.averageActualDuration)}</dd>
        </div>
        <div>
          <dt>Base</dt>
          <dd>{formatDuration(summary.lastBaseDuration)}</dd>
        </div>
        <div>
          <dt>Data rows</dt>
          <dd>{rowCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Rows in DOM</dt>
          <dd>{renderedRows.toLocaleString()}</dd>
        </div>
      </dl>

      <div className="interaction-readout" aria-live="polite">
        <span>Last interaction</span>
        <strong>{latestInteraction ? `${latestInteraction.label}: ${formatDuration(latestInteraction.duration)}` : "No interaction measured"}</strong>
      </div>

      <div className="scenario-grid" aria-label="Benchmark scenarios">
        {BENCHMARK_SCENARIOS.map((scenario) => (
          <button key={scenario.id} type="button" onClick={() => onRunScenario(scenario.id)}>
            {scenario.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
