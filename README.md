# Frontend Performance Engineering Lab

[![CI](https://github.com/DanieleMasone/frontend-performance-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/DanieleMasone/frontend-performance-lab/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-0f8b8d)](https://DanieleMasone.github.io/frontend-performance-lab/)
[![License: MIT](https://img.shields.io/badge/License-MIT-172033)](LICENSE)

A portfolio-grade React and TypeScript performance engineering lab that compares an intentionally slow dashboard with an optimized version of the same UI, data, and benchmark scenarios.

The repository demonstrates measurement, diagnosis, targeted optimization, testing, and static delivery rather than a generic CRUD implementation.

## Explore

- [Project site](https://DanieleMasone.github.io/frontend-performance-lab/)
- [Slow app](https://DanieleMasone.github.io/frontend-performance-lab/slow/)
- [Optimized app](https://DanieleMasone.github.io/frontend-performance-lab/optimized/)
- [User Guide](https://DanieleMasone.github.io/frontend-performance-lab/docs/user-guide/)

## What It Demonstrates

- controlled React Profiler and Browser Performance API instrumentation
- deterministic data and benchmark scenarios
- a comparable intentionally slow and optimized implementation
- targeted memoization, virtualization, lazy loading, debouncing, and state locality
- responsive and accessible enterprise dashboard behavior
- Vitest unit/component coverage and Playwright Chromium E2E coverage
- TypeDoc, coverage, documentation, and demos published through GitHub Pages

## Controlled Comparison

Both apps default to the same deterministic 20,000-row dataset and preserve the same controls, visual language, and benchmark flows. The [User Guide comparison](docs/user-guide.md#slow-vs-optimized) explains the implementation differences; the [Benchmark Protocol](benchmark/README.md) defines how to measure them consistently.

## Architecture

| Path | Purpose |
| --- | --- |
| `slow-app/` | Deliberately inefficient React and Vite implementation |
| `optimized-app/` | Equivalent UI with targeted performance optimizations |
| `benchmark/src/` | Shared data, profiling, hooks, reusable UI, virtualization math, and design tokens |
| `docs/` | User Guide and focused measurement documentation |
| `benchmark/README.md` | Canonical benchmark protocol |
| `e2e/` | Playwright tests against the production Pages-like artifact |
| `scripts/` | Static-site assembly, serving, and verification |

The stack is React, TypeScript, Vite, Vitest, Testing Library, Playwright, and TypeDoc. Exact versions are pinned in `package.json`.

## Quick Start

Use Node.js `>=24.15.0 <25` and npm.

```bash
npm ci
npm run dev:slow
```

Run `npm run dev:optimized` instead to start the optimized implementation. For the complete local quality gate and Pages-like artifact:

```bash
npx playwright install chromium
npm run verify
npm run pages:serve
```

See the [User Guide](docs/user-guide.md) for the review path, benchmark workflow, testing commands, documentation map, and troubleshooting.

## Documentation

- [User Guide](docs/user-guide.md): practical setup, review, benchmark, testing, and troubleshooting entry point
- [Benchmark Protocol](benchmark/README.md): canonical scenarios, fixed inputs, and measurement rules
- [Metrics](docs/metrics.md): runtime signals and result fields
- [Profiling Notes](docs/profiling-notes.md): instrumentation and implementation context
- [Browser Trace Export](docs/browser-trace-export.md): manual DevTools trace workflow
- [Results Before and After](docs/results-before-after.md): placeholders for real measurements
- [TypeDoc Overview](docs/typedoc-overview.md): generated API reference scope
- [Published TypeDoc](https://DanieleMasone.github.io/frontend-performance-lab/typedoc/)
- [Published Coverage](https://DanieleMasone.github.io/frontend-performance-lab/coverage/)

Manual result placeholders remain empty until measurements are collected in a real browser. The repository does not publish invented performance numbers.

## CI And Delivery

GitHub Actions uses Node.js 24.x and `npm ci`, then runs typecheck, lint, unit/component tests, coverage, production builds, TypeDoc generation, Pages assembly, and Playwright Chromium E2E tests.

The Pages artifact contains the two apps, User Guide, focused documentation, benchmark protocol, coverage, and TypeDoc. Deployment runs only from the repository default branch.

## License

Released under the MIT License. See [LICENSE](LICENSE).

Copyright (c) 2026 Daniele Masone.
