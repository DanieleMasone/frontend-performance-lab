# Frontend Performance Engineering Lab

[![CI](https://github.com/DanieleMasone/frontend-performance-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/DanieleMasone/frontend-performance-lab/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-0f8b8d)](https://DanieleMasone.github.io/frontend-performance-lab/)
[![React](https://img.shields.io/badge/React-19.2.7-2f80ed)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.16-646cff)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178c6)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-172033)](LICENSE)

A production-grade React and TypeScript performance engineering lab that compares an intentionally slow frontend with an optimized version of the same enterprise dashboard UI.

This repository is not a generic CRUD app. It is a portfolio case study for measuring, explaining, and improving frontend performance with reproducible scenarios.

## Project Positioning

The lab demonstrates senior-level frontend performance work:

- creating a realistic bottleneck without breaking usability
- measuring render and interaction cost with source-level instrumentation
- applying targeted optimizations rather than broad memoization
- documenting the trade-offs and remaining limits
- publishing demos, coverage, TypeDoc, and benchmark notes through GitHub Pages

## Repository Structure

```txt
frontend-performance-lab/
├── slow-app/                 # intentionally inefficient React + Vite app
├── optimized-app/            # same UI with targeted performance optimizations
├── benchmark/                # shared data, profiling, theme, and virtualization utilities
├── docs/                     # metrics, profiling notes, before/after result templates
├── scripts/                  # GitHub Pages artifact assembly
├── .github/workflows/ci.yml  # CI and Pages deployment
├── AGENTS.md                 # future Codex/session guidance
├── README.md
├── LICENSE
├── package.json
└── tsconfig.json
```

## Tech Stack

Versions were checked against current stable package metadata on June 11, 2026.

| Area | Choice |
| --- | --- |
| Runtime | Node.js 24.15.0, npm |
| UI | React 19.2.7, React DOM 19.2.7 |
| Build | Vite 8.0.16, `@vitejs/plugin-react` 6.0.2 |
| Language | TypeScript 6.0.3 |
| Tests | Vitest 4.1.8, Testing Library React 16.3.2, user-event 14.6.1 |
| DOM test environment | jsdom 29.1.1 |
| Coverage | `@vitest/coverage-v8` 4.1.8 |
| API docs | TypeDoc 0.28.19 |
| CI actions | checkout/setup-node/configure-pages v6, upload/deploy Pages v5 |

`jsdom` is used instead of `happy-dom` because the tests exercise accessible controls, focus, DOM events, and browser-like APIs where compatibility is more valuable than the fastest possible test environment.

## Slow vs Optimized

Both apps use the same deterministic account dataset, visual layout, benchmark scenarios, and controls.

The slow app deliberately includes:

- 20,000 account rows rendered without virtualization
- expensive filtering and sorting during render
- broad top-level state updates
- unstable inline callbacks
- non-memoized heavy chart calculations
- a heavy chart module included in the initial app bundle
- eager image loading and synchronous image decoding
- repeated derived data recalculation

The optimized app applies:

- `useMemo` for expensive derived data
- `React.memo` only on the high-volume virtualized row component
- `useCallback` for callbacks passed into expensive child trees
- manual table virtualization
- `React.lazy` and `Suspense` for the heavy chart section
- native lazy image loading and async decoding
- debounced search input
- local table selection state

## Benchmark Methodology

The built-in benchmark panels use:

- React Profiler API for commit counts, actual duration, and base duration
- Browser Performance API with `performance.mark()` and `performance.measure()`
- deterministic scenario controls for initial render, search/filter, large table scroll, chart toggle, and gallery load

Recommended manual profiling flow:

1. Run `npm run build` and `npm run pages:build`.
2. Serve or open the generated Pages artifact.
3. Start with `/slow/`, run every benchmark control, and record values.
4. Repeat the same interactions in `/optimized/`.
5. Fill `docs/results-before-after.md` with real measurements only.

## Metrics Collected

| Metric | Source |
| --- | --- |
| React actual render duration | React Profiler API |
| React base render duration | React Profiler API |
| Commit count | React Profiler API |
| Interaction duration | Browser Performance API |
| Rows rendered in DOM | app benchmark panel |
| Bundle and chunk size | Vite production output |
| Coverage | Vitest V8 HTML report |
| Manual before/after delta | `docs/results-before-after.md` |

## Commands

```bash
npm ci
npm run dev:slow
npm run dev:optimized
npm run typecheck
npm run lint
npm run test
npm run coverage
npm run build
npm run docs
npm run pages:build
```

The full local verification sequence is:

```bash
npm ci
npm run typecheck
npm run test
npm run coverage
npm run build
npm run docs
npm run pages:build
```

## GitHub Pages

Expected deployment root:

[https://DanieleMasone.github.io/frontend-performance-lab/](https://DanieleMasone.github.io/frontend-performance-lab/)

Pages artifact layout:

```txt
site/
├── index.html
├── slow/
├── optimized/
├── coverage/
├── typedoc/
├── docs/
└── benchmark/
```

The Vite base paths are configured for repository Pages deployment:

- `/frontend-performance-lab/slow/`
- `/frontend-performance-lab/optimized/`

## Documentation

- [Metrics](docs/metrics.md)
- [Profiling Notes](docs/profiling-notes.md)
- [Before/After Results](docs/results-before-after.md)
- [Benchmark Protocol](benchmark/README.md)

TypeDoc documents the shared benchmark, profiling, theme, debounce, and virtualization helpers plus the benchmark panel and optimized virtual table APIs. It intentionally avoids documenting every small React component.

## Trade-Offs

| Optimization | Benefit | Trade-off |
| --- | --- | --- |
| Memoized filtering | Avoids repeated expensive derivation | Requires careful dependency management |
| `React.memo` on virtual rows | Reduces high-volume child re-renders | Adds value only because row props are stable |
| Manual virtualization | Cuts DOM pressure dramatically | Adds scroll math and ARIA complexity |
| Lazy chart loading | Reduces initial bundle cost | First chart open may wait for a chunk |
| Debounced search | Reduces repeated filter work | Results update after a short delay |
| Lazy images | Reduces initial image work | Below-fold images load later |

## Review Path

1. Read `benchmark/src/data.ts` and `benchmark/src/profiling.ts`.
2. Run the slow app and inspect the full table, eager gallery, and benchmark panel.
3. Run the optimized app and compare virtualization, lazy chart behavior, and interaction stability.
4. Review `docs/profiling-notes.md` for the intended measurement process.
5. Review generated coverage and TypeDoc from the Pages artifact.

## Limitations

- The benchmark panel records runtime signals but does not automate browser-level performance scoring.
- Manual result placeholders are intentionally not filled with fake numbers.
- The dataset is synthetic and deterministic, so business labels are realistic but not production data.
- No Playwright or Lighthouse CI is included because the current scope is source-level performance instrumentation, unit behavior, and Pages delivery.

## Future Improvements

- Add optional browser trace export instructions.
- Add a controlled Web Vitals collector for deployed Pages.
- Add a documented Lighthouse workflow once real budgets are agreed.
- Add CI performance budgets after baseline manual results are captured.
