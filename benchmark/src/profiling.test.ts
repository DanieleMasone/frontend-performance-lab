import { describe, expect, it, vi } from "vitest";
import {
  createProfilerCallback,
  formatDuration,
  measureInteraction,
  summarizeProfilerSamples,
  toProfilerSample
} from "./profiling";

describe("profiling utilities", () => {
  it("summarizes profiler samples", () => {
    expect(summarizeProfilerSamples([])).toEqual({
      commitCount: 0,
      lastActualDuration: 0,
      averageActualDuration: 0,
      maxActualDuration: 0,
      lastBaseDuration: 0
    });

    const samples = [
      toProfilerSample("App", "mount", 4, 8, 1, 2),
      toProfilerSample("App", "update", 10, 12, 3, 4)
    ];

    expect(summarizeProfilerSamples(samples)).toEqual({
      commitCount: 2,
      lastActualDuration: 10,
      averageActualDuration: 7,
      maxActualDuration: 10,
      lastBaseDuration: 12
    });
  });

  it("formats durations defensively", () => {
    expect(formatDuration(12.345)).toBe("12.3 ms");
    expect(formatDuration(0)).toBe("0.0 ms");
    expect(formatDuration(Number.NaN)).toBe("0.0 ms");
  });

  it("measures interactions and returns the action result", () => {
    const measured = measureInteraction("search-filter", "Search benchmark", () => "done");

    expect(measured.result).toBe("done");
    expect(measured.measure.scenario).toBe("search-filter");
    expect(measured.measure.label).toBe("Search benchmark");
    expect(measured.measure.duration).toBeGreaterThanOrEqual(0);
  });

  it("creates a React profiler callback that publishes normalized samples", () => {
    const publish = vi.fn();
    const callback = createProfilerCallback(publish);

    callback("App", "mount", 1, 2, 3, 4);

    expect(publish).toHaveBeenCalledWith({
      id: "App",
      phase: "mount",
      actualDuration: 1,
      baseDuration: 2,
      startTime: 3,
      commitTime: 4
    });
  });
});
