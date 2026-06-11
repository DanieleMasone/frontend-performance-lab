# Metrics

This project records runtime metrics in the app benchmark panels and keeps manual benchmark results in `docs/results-before-after.md`.

## Runtime Metrics

| Metric | Source | Slow app expectation | Optimized app expectation |
| --- | --- | --- | --- |
| Commit count | React Profiler API | Higher during broad state updates | Lower or more localized |
| Actual render duration | React Profiler API | Higher during search, sort, chart, and table updates | Lower after memoization and virtualization |
| Base render duration | React Profiler API | Reflects full tree cost | Reflects smaller rendered tree |
| Interaction duration | Browser Performance API | Measures event-side work for benchmark controls | Measures event-side work after optimized state flow |
| Rows in DOM | App benchmark panel | Equal to filtered result count | Equal to virtual window size |
| Bundle output | Vite build output | Heavy chart included in initial app bundle | Heavy chart emitted as a lazy chunk |
| Coverage | Vitest V8 provider | HTML generated into `site/coverage/` | HTML generated into `site/coverage/` |

## Manual Measurement Fields

Use these fields when filling `docs/results-before-after.md`:

| Field | Description |
| --- | --- |
| Browser | Browser name and version |
| Hardware | CPU/RAM or machine description |
| Viewport | Width and height |
| Dataset size | Number of generated rows |
| Slow result | Measured value from slow app |
| Optimized result | Measured value from optimized app |
| Delta | Absolute difference |
| Improvement | Percentage improvement, when meaningful |
| Notes | Observed trade-offs or anomalies |

## Placeholder Policy

Do not invent numbers. Keep `Manual measurement pending` until the value has been collected from a real browser run.
