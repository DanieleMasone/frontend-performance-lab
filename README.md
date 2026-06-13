# Frontend Performance Engineering Lab

[![CI](https://github.com/DanieleMasone/frontend-performance-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/DanieleMasone/frontend-performance-lab/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-0f8b8d)](https://DanieleMasone.github.io/frontend-performance-lab/)
[![React](https://img.shields.io/badge/React-19.2.7-2f80ed)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.16-646cff)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178c6)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.60.0-2ead33)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-172033)](LICENSE)

A portfolio-grade React and TypeScript performance engineering lab that compares an intentionally slow dashboard with an optimized version of the same user-facing UI and benchmark scenarios.

This is not a generic CRUD app. It is a case study in measurement, diagnosis, targeted optimization, testing, and publication.

## Live Demo

- [Project root](https://DanieleMasone.github.io/frontend-performance-lab/)
- [Slow app](https://DanieleMasone.github.io/frontend-performance-lab/slow/)
- [Optimized app](https://DanieleMasone.github.io/frontend-performance-lab/optimized/)
- [Coverage](https://DanieleMasone.github.io/frontend-performance-lab/coverage/)
- [TypeDoc](https://DanieleMasone.github.io/frontend-performance-lab/typedoc/)
- [Documentation](https://DanieleMasone.github.io/frontend-performance-lab/docs/)
- [Results template](https://DanieleMasone.github.io/frontend-performance-lab/docs/results-before-after/)
- [Benchmark protocol](https://DanieleMasone.github.io/frontend-performance-lab/benchmark/)

## Project Positioning

The lab demonstrates frontend performance engineering work that can be reviewed and rerun:

- realistic bottlenecks that keep the slow app usable but measurably expensive
- shared deterministic data and controls across both apps
- React Profiler and Browser Performance API instrumentation
- targeted optimizations instead of blanket memoization
- unit/component coverage plus production-mode Playwright E2E smoke coverage
- GitHub Pages output for demos, coverage, TypeDoc, docs, and benchmark notes

## Repository Structure

```txt
frontend-performance-lab/
|-- slow-app/                 # intentionally inefficient React + Vite app
|-- optimized-app/            # same UI with targeted performance optimizations
|-- benchmark/                # shared data, profiling, theme, debounce, virtualization, UI, and style utilities
|-- docs/                     # source metrics, profiling, TypeDoc, and result templates
|-- e2e/                      # Playwright Chromium E2E tests
|-- scripts/                  # Pages assembly and local static server
|-- .github/workflows/ci.yml  # CI and Pages deployment
|-- AGENTS.md
|-- README.md
|-- package.json
`-- tsconfig.json
```

## Tech Stack

Versions were checked against current stable package metadata on June 12, 2026.

| Area | Choice |
| --- | --- |
| Runtime | Node.js `>=24.15.0 <25` locally, Node.js 24.x in CI, npm |
| UI | React 19.2.7, React DOM 19.2.7 |
| Build | Vite 8.0.16, `@vitejs/plugin-react` 6.0.2 |
| Language | TypeScript 6.0.3 |
| Unit/component tests | Vitest 4.1.8, Testing Library React 16.3.2, user-event 14.6.1, jsdom 29.1.1 |
| E2E tests | Playwright 1.60.0, Chromium only by default |
| Coverage | `@vitest/coverage-v8` 4.1.8 |
| API docs | TypeDoc 0.28.19 |
| CI actions | checkout/setup-node/configure-pages v6, upload/deploy Pages v5, upload-artifact v7 |

## Slow vs Optimized

Both apps use the same deterministic account dataset, dashboard layout, controls, benchmark scenarios, and result readouts.

The slow app deliberately includes:

- 20,000 account rows rendered without virtualization
- expensive filtering and sorting during render
- broad top-level state updates
- unstable inline callbacks
- non-memoized heavy chart calculations
- heavy chart code in the initial app bundle
- eager image loading and synchronous image decoding

The optimized app applies:

- `useMemo` for expensive derivation
- `React.memo` only for high-volume virtual rows
- stable callbacks for expensive child trees
- manual table virtualization
- `React.lazy` and `Suspense` for the heavy chart
- native lazy image loading and async decoding
- debounced search input
- local table row selection state

## Testing Strategy

Unit and component tests cover shared utilities, app shells, controls, benchmark panels, theme persistence, debounce behavior, deterministic data, profiling helpers, virtualization math, lazy chart behavior, image gallery behavior, and keyboard table scrolling.

Playwright E2E tests run against the production Pages-like artifact served under `/frontend-performance-lab/`. The suite checks:

- root navigation and generated internal links
- slow app benchmark, search, full table, chart, gallery, and metrics flows
- optimized app benchmark, search, virtualization, lazy chart, and metrics flows
- dark mode persistence in both apps
- mobile responsive smoke coverage without global horizontal overflow
- accessibility smoke coverage for landmarks, labels, keyboard reachability, and table structure

Normal production pages default to the full 20,000-row dataset. The E2E suite passes a deterministic `?rows=1200` runtime override so the slow app still renders a large non-virtualized table without making every browser smoke test depend on a 20,000-row DOM load.

Coverage thresholds:

| Metric | Threshold |
| --- | ---: |
| Statements | 80% |
| Branches | 70% |
| Functions | 75% |
| Lines | 80% |

## Commands

```bash
npm ci
npm run dev:slow
npm run dev:optimized
npm run typecheck
npm run lint
npm run test
npm run test:watch
npm run coverage
npm run build
npm run docs
npm run pages:build
npx playwright install chromium
npm run e2e
npm run e2e:ui
npm run e2e:report
npm run verify
```

`npm run verify` is the full local quality gate:

```bash
npm run typecheck
npm run lint
npm run test
npm run coverage
npm run build
npm run docs
npm run pages:build
npm run e2e
```

The E2E suite expects production assets, coverage, TypeDoc, and docs to exist in `site/`, which `verify` prepares before running Playwright.

## GitHub Pages

Expected deployment root:

[https://DanieleMasone.github.io/frontend-performance-lab/](https://DanieleMasone.github.io/frontend-performance-lab/)

Pages artifact layout:

```txt
site/
|-- index.html
|-- slow/
|-- optimized/
|-- coverage/
|-- typedoc/
|-- docs/
|   |-- index.html
|   |-- metrics/
|   |-- profiling-notes/
|   `-- results-before-after/
`-- benchmark/
    `-- index.html
```

The root page links to generated HTML routes, not raw Markdown files. Vite base paths stay compatible with repository Pages deployment:

- `/frontend-performance-lab/slow/`
- `/frontend-performance-lab/optimized/`

## Documentation

- [Metrics](docs/metrics.md)
- [Profiling Notes](docs/profiling-notes.md)
- [Before/After Results](docs/results-before-after.md)
- [Benchmark Protocol](benchmark/README.md)
- [TypeDoc Overview](docs/typedoc-overview.md)

Manual result placeholders must remain placeholders until real browser measurements are collected.

## CI Behavior

The GitHub Actions workflow runs on pushes to `main`/`master`, pull requests, and manual dispatch. It uses Node.js 24.x, installs with `npm ci`, runs typecheck, lint, unit/component tests, coverage, app builds, TypeDoc, Pages assembly, Playwright Chromium installation, and E2E tests.

The Playwright HTML report is uploaded as a workflow artifact on failure and is not published to GitHub Pages. Pages deployment runs only from the repository default branch.

## Trade-Offs

| Optimization | Benefit | Trade-off |
| --- | --- | --- |
| Memoized filtering | Avoids repeated expensive derivation | Requires careful dependencies |
| `React.memo` on virtual rows | Reduces high-volume child re-renders | Useful only because row props are stable |
| Manual virtualization | Cuts DOM pressure dramatically | Adds scroll math and ARIA responsibility |
| Lazy chart loading | Reduces initial bundle cost | First chart open may wait for a chunk |
| Debounced search | Reduces repeated filter work | Results update after a short delay |
| Lazy images | Reduces initial image work | Below-fold images load later |

## Limitations

- Runtime panel measurements do not replace a full browser trace.
- JSDOM validates behavior, not real rendering performance.
- Playwright checks user-visible flows but does not assert pixel layouts or performance budgets.
- The dataset is synthetic and deterministic.
- Manual result tables are intentionally not filled with invented numbers.
- Lighthouse CI is not included until real budgets and a clear need exist.

## Future Improvements

- Add optional browser trace export instructions.
- Add a controlled Web Vitals collector for deployed Pages.
- Add a documented Lighthouse workflow after performance budgets are agreed.
- Add CI performance budgets once real baseline measurements are recorded.
