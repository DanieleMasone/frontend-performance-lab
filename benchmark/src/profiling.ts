import type { ProfilerOnRenderCallback } from "react";

export type BenchmarkScenarioId =
  | "initial-render"
  | "search-filter"
  | "table-scroll"
  | "chart-toggle"
  | "gallery-toggle";

export interface BenchmarkScenario {
  id: BenchmarkScenarioId;
  label: string;
  description: string;
}

export interface ProfilerSample {
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

export interface RenderSummary {
  commitCount: number;
  lastActualDuration: number;
  averageActualDuration: number;
  maxActualDuration: number;
  lastBaseDuration: number;
}

export interface InteractionMeasure {
  scenario: BenchmarkScenarioId | string;
  label: string;
  duration: number;
  startedAt: number;
}

export const BENCHMARK_SCENARIOS: readonly BenchmarkScenario[] = [
  {
    id: "initial-render",
    label: "Initial render",
    description: "Regenerates the portfolio data and records the resulting commit cost."
  },
  {
    id: "search-filter",
    label: "Search/filter",
    description: "Applies the standard enterprise search benchmark."
  },
  {
    id: "table-scroll",
    label: "Large table scroll",
    description: "Scrolls the account grid deep into the data set."
  },
  {
    id: "chart-toggle",
    label: "Heavy chart toggle",
    description: "Toggles the revenue concentration chart."
  },
  {
    id: "gallery-toggle",
    label: "Image gallery toggle",
    description: "Hides or reveals the synthetic gallery images."
  }
];

export function toProfilerSample(
  id: string,
  phase: ProfilerSample["phase"],
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
): ProfilerSample {
  return {
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  };
}

export function summarizeProfilerSamples(samples: readonly ProfilerSample[]): RenderSummary {
  if (samples.length === 0) {
    return {
      commitCount: 0,
      lastActualDuration: 0,
      averageActualDuration: 0,
      maxActualDuration: 0,
      lastBaseDuration: 0
    };
  }

  const total = samples.reduce((sum, sample) => sum + sample.actualDuration, 0);
  const max = samples.reduce((largest, sample) => Math.max(largest, sample.actualDuration), 0);
  const last = samples[samples.length - 1];

  return {
    commitCount: samples.length,
    lastActualDuration: last.actualDuration,
    averageActualDuration: total / samples.length,
    maxActualDuration: max,
    lastBaseDuration: last.baseDuration
  };
}

export function formatDuration(duration: number): string {
  if (!Number.isFinite(duration) || duration <= 0) {
    return "0.0 ms";
  }

  return `${duration.toFixed(1)} ms`;
}

export function measureInteraction<T>(
  scenario: BenchmarkScenarioId | string,
  label: string,
  action: () => T
): { result: T; measure: InteractionMeasure } {
  const marker = `${scenario}-${Math.round(performance.now() * 1000)}`;
  const start = `${marker}-start`;
  const end = `${marker}-end`;

  performance.mark(start);
  const result = action();
  performance.mark(end);
  performance.measure(label, start, end);

  const entry = performance.getEntriesByName(label).at(-1);

  return {
    result,
    measure: {
      scenario,
      label,
      duration: entry?.duration ?? 0,
      startedAt: entry?.startTime ?? performance.now()
    }
  };
}

export const createProfilerCallback = (
  publish: (sample: ProfilerSample) => void
): ProfilerOnRenderCallback => {
  return (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    publish(toProfilerSample(id, phase, actualDuration, baseDuration, startTime, commitTime));
  };
};
