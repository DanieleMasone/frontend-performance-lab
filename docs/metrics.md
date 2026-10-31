# Metrics

This project records runtime metrics in the app benchmark panels and keeps manual benchmark results in [Results Before and After](/frontend-performance-lab/docs/results-before-after/).

## Runtime Metrics

| Metric | Source | Slow app expectation | Optimized app expectation |
| --- | --- | --- | --- |
| Commit count | React Profiler API, published sample window | Reveals broad state updates | Reveals localized updates |
| Actual render duration | React Profiler API | Higher during search, sort, chart, and table updates | Lower after memoization and virtualization |
| Base render duration | React Profiler API | Reflects full tree cost | Reflects smaller rendered tree |
| Interaction duration | Browser Performance API | Measures event-side work for benchmark controls | Measures event-side work after optimized state flow |
| Rows in DOM | App benchmark panel | Equal to filtered result count | Equal to virtual window size |
| Bundle output | Vite build output | Heavy chart included in initial app bundle | Heavy chart emitted as a lazy chunk |
| Coverage | Vitest V8 provider | HTML generated into `site/coverage/` | HTML generated into `site/coverage/` |

## Measurement Boundaries

The normal production build, including GitHub Pages, disables React Profiler timing. Its zero commit/render readouts mean no profiler samples were recorded, not zero rendering cost. Use production browser traces for responsiveness and the development or profiling builds described in [Profiling Notes](/frontend-performance-lab/docs/profiling-notes/#react-profiling-builds) for React attribution.

Interaction measures wrap only the synchronous scenario callback. React state updates schedule later work; these measures exclude deferred rendering, the search debounce, lazy imports, and the next paint. They are neither end-to-end interaction latency nor INP. The "Initial render" button regenerates data in the mounted app; only a fresh navigation measures initial loading.

Profiler samples cover the main dashboard subtree, excluding data derivation executed in the parent App and the controls/benchmark panel. Publication is throttled and retains a rolling window, so the displayed commit count is not a session total. Actual/base durations describe React rendering, not layout or paint.

Gallery assets are embedded SVG data URLs: eager/lazy attributes illustrate loading and decoding strategies, not network-transfer savings. Chart values use a shared synthetic workload and are not accounting totals. Lazy chunk emission alone does not prove a smaller total or initial bundle; compare the emitted assets.

## Manual Measurement Fields

Use these fields when filling [Results Before and After](/frontend-performance-lab/docs/results-before-after/):

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
