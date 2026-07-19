# User Guide

Use this guide to run the lab, review the slow and optimized implementations, and find the right supporting documentation. Detailed metric definitions, profiling notes, trace instructions, and result tables remain in their dedicated pages.

## Project Overview

Frontend Performance Lab compares two React dashboards with the same dataset, controls, visual design, and benchmark scenarios:

- the slow implementation keeps deliberate render, DOM, bundle, and asset-loading pressure
- the optimized implementation applies targeted memoization, virtualization, lazy loading, debouncing, and state locality

The comparison is designed for repeatable engineering review. The slow app is intentionally inefficient, but it should remain usable and behaviorally equivalent to the optimized app.

## Repository Architecture

| Path | Responsibility |
| --- | --- |
| `slow-app/` | Intentionally inefficient React and Vite implementation |
| `optimized-app/` | Equivalent UI with targeted performance optimizations |
| `benchmark/src/` | Shared deterministic data, profiling helpers, hooks, UI, and design tokens |
| `benchmark/README.md` | Canonical benchmark scenarios and measurement rules |
| `docs/` | User guide and focused measurement documentation |
| `e2e/` | Playwright tests against the production Pages-like artifact |
| `scripts/` | Static-site assembly, serving, and verification orchestration |
| `site/` | Generated GitHub Pages artifact; never edit it manually |

## Review Path

1. Open the [project home](/frontend-performance-lab/) for the published artifact map.
2. Review the [slow app](/frontend-performance-lab/slow/) and run its benchmark controls.
3. Repeat the same interactions in the [optimized app](/frontend-performance-lab/optimized/).
4. Use the [Benchmark Protocol](/frontend-performance-lab/benchmark/) to keep inputs and scenario order consistent.
5. Read [Metrics](/frontend-performance-lab/docs/metrics/) and [Profiling Notes](/frontend-performance-lab/docs/profiling-notes/) when interpreting the panels.
6. Record only real measurements in [Results Before and After](/frontend-performance-lab/docs/results-before-after/).

## Running Locally

Use Node.js `>=24.15.0 <25` and npm.

Install dependencies:

```bash
npm ci
```

Start either implementation in Vite development mode:

```bash
npm run dev:slow
npm run dev:optimized
```

Run one development command at a time and use the URL printed by Vite.

For the complete production-like artifact and validation flow:

```bash
npx playwright install chromium
npm run verify
npm run pages:serve
```

Open the URL printed by the static server. The local site uses the same `/frontend-performance-lab/` base path as GitHub Pages.

## Benchmark Workflow

The [Benchmark Protocol](/frontend-performance-lab/benchmark/) is the source of truth for scenarios, fixed inputs, and measurement rules.

For a review session:

1. Use production output from `npm run verify` or the deployed Pages site.
2. Keep browser version, viewport, dataset size, and interaction order identical for both apps.
3. Run each scenario once as a warm-up, then repeat it for the recorded observation.
4. Compare React Profiler commits, interaction duration, rows in the DOM, and production bundle output.
5. Use [Browser Trace Export](/frontend-performance-lab/docs/browser-trace-export/) when panel metrics need main-thread evidence.
6. Store observations in the [Results template](/frontend-performance-lab/docs/results-before-after/) without estimating missing values.

## Slow vs Optimized

| Area | Slow implementation | Optimized implementation |
| --- | --- | --- |
| Data derivation | Recomputed during render | Memoized around stable inputs |
| Search | Applies every input change | Applies a short debounce |
| Account table | Renders the full result set | Renders a virtual window |
| Chart | Included in the initial bundle | Loaded through a lazy boundary |
| Images | Eager loading and synchronous decoding | Lazy loading and asynchronous decoding |
| State and callbacks | Broad state ownership and unstable callbacks | Local state and stable callbacks on expensive paths |

These differences are intentional. Visual design, data, controls, and benchmark scenarios should remain comparable.

## Interpreting Metrics

Treat the dashboard values as evidence from the current browser session, not universal performance scores. Compare slow and optimized runs only under matched conditions.

Use [Metrics](/frontend-performance-lab/docs/metrics/) for definitions and expected signals. Use [Profiling Notes](/frontend-performance-lab/docs/profiling-notes/) for implementation context and DevTools checks. Source-level marks and JSDOM tests do not replace a real browser trace.

## Browser Traces

Capture a trace only when you need to explain scripting, rendering, layout, paint, or main-thread blocking for one focused scenario. Follow [Browser Trace Export](/frontend-performance-lab/docs/browser-trace-export/) for the manual Chrome or Edge DevTools workflow.

Trace files are local measurement artifacts and are not generated by CI.

## Testing Strategy

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Validate strict TypeScript contracts |
| `npm run lint` | Check source and test quality rules |
| `npm run test` | Run Vitest unit and component tests |
| `npm run coverage` | Generate V8 coverage under `site/coverage/` |
| `npm run e2e` | Run Chromium E2E tests against the assembled site |
| `npm run verify` | Execute the complete local quality gate |

Playwright uses a deterministic row-count override to bound E2E runtime. Published app routes still default to 20,000 rows.

## Documentation Map

| Resource | Use it for |
| --- | --- |
| [Documentation index](/frontend-performance-lab/docs/) | Browse all published guides and reports |
| [Benchmark Protocol](/frontend-performance-lab/benchmark/) | Scenarios, fixed inputs, and measurement rules |
| [Metrics](/frontend-performance-lab/docs/metrics/) | Runtime and manual result field definitions |
| [Profiling Notes](/frontend-performance-lab/docs/profiling-notes/) | Instrumentation and implementation context |
| [Browser Trace Export](/frontend-performance-lab/docs/browser-trace-export/) | Manual trace capture and review |
| [Results Before and After](/frontend-performance-lab/docs/results-before-after/) | Real measurement recording template |
| [TypeDoc](/frontend-performance-lab/typedoc/) | Reusable TypeScript API reference |
| [Coverage](/frontend-performance-lab/coverage/) | Generated unit and component coverage report |

## Troubleshooting

### npm reports an unsupported engine

Check `node --version`. The repository requires Node.js `>=24.15.0 <25`.

### npm ci reports that the lockfile is out of sync

Use the committed `package-lock.json`. When dependencies intentionally change, regenerate and commit the lockfile with the repository's npm version before running `npm ci` again.

### Playwright cannot find Chromium

Run:

```bash
npx playwright install chromium
```

### Coverage or TypeDoc is missing from the local site

Run `npm run verify` before `npm run pages:serve`. The verification command generates coverage, app builds, TypeDoc, documentation pages, and the final Pages-like artifact.

### A direct local route returns 404

Use `npm run pages:serve` and open the `/frontend-performance-lab/` URL printed by the server. Opening generated HTML directly does not reproduce the deployed base path.
