# Browser Trace Export

Browser traces are useful when the benchmark panel shows a slow interaction and you need to inspect what the browser did on the main thread. Use traces as manual evidence alongside the React Profiler and benchmark readouts; they are not generated automatically by this project.

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

## Saving Trace Files

Use the Performance panel export action to save a `.json` trace file when you need to share or archive evidence.

Trace exports are local measurement artifacts. Keep them outside the repository unless a small reviewed example is intentionally added to documentation.
