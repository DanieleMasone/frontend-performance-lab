# Browser Trace Export

Browser traces are useful when the benchmark panel shows a slow interaction and you need to inspect what the browser did on the main thread. Use traces as manual evidence alongside the React Profiler and benchmark readouts; they are not generated automatically by this project.

Keep the browser, viewport, dataset, and interaction sequence aligned with the [Benchmark Protocol](/frontend-performance-lab/benchmark/).

## When To Capture A Trace

Capture a trace when you need to inspect:

- long tasks
- scripting time
- rendering time
- layout or recalculated style
- paint cost
- main-thread blocking

Recommended scenarios:

- slow app initial load
- optimized app initial load
- slow app search/filter
- optimized app search/filter
- large table scroll
- chart toggle

## Capture Steps

1. Build the production artifact with `npm run build` and `npm run pages:build`.
2. Serve `site/` locally with `npm run pages:serve`, or open the deployed GitHub Pages site.
3. Open Chrome or Edge DevTools.
4. Open the Performance panel.
5. Enable screenshots only if they help explain the interaction.
6. Start recording.
7. Perform exactly one benchmark scenario.
8. Stop recording after the UI settles.
9. Repeat the same scenario in the other app using the same browser, viewport, and dataset size.

Keep each recording focused. A short trace for one scenario is easier to review than a long trace containing several unrelated interactions.

## What To Inspect

Review the main thread and summary panes for:

- long tasks around the interaction
- scripting cost from React rendering and data derivation
- rendering, layout, and style recalculation cost
- paint cost from large DOM or chart/gallery updates
- scroll responsiveness during the table scenario
- whether the optimized chart loads as a separate chunk before rendering

The slow app should show real pressure without being broken. The optimized app should show targeted improvements while preserving the same user-facing workflow.

## Interaction Attribution

In the Performance panel, select the interaction and distinguish input delay (waiting for the main thread), processing duration (event callbacks), and presentation delay (work until the next paint). See the [INP definition](https://web.dev/articles/inp). A single lab interaction is diagnostic evidence, not a field INP score. For debounced search, also inspect when the filtered results appear: the next paint may only show the input update, before the debounce finishes.

Correlate the app's User Timing marks with main-thread scripting, style/layout, and paint. The marks cover synchronous callbacks only; use the surrounding timeline to account for deferred work. React-specific attribution is described in [Profiling Notes](/frontend-performance-lab/docs/profiling-notes/#react-profiling-builds).

The [Long Animation Frames API](https://developer.chrome.com/docs/web-platform/long-animation-frames) can add attribution for frames exceeding 50 ms, including scripts and forced style/layout work. In a supported browser, inspect the corresponding frame and script details alongside the interaction trace. API availability can be checked in DevTools with `PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')`; missing support or missing entries does not establish that an interaction was fast. The lab does not install an observer or collect production telemetry.

## Saving Trace Files

Use the Performance panel export action to save a `.json` trace file when you need to share or archive evidence.

Trace exports are local measurement artifacts. Keep them outside the repository unless a small reviewed example is intentionally added to documentation.
