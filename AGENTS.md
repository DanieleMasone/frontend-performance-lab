# AGENTS.md

## Project Purpose

`frontend-performance-lab` is a portfolio-grade frontend performance engineering repository. It compares an intentionally slow React dashboard with an optimized version of the same UI and benchmark scenarios.

The goal is to demonstrate measurement, diagnosis, targeted optimization, testing, and documentation. Do not turn this into a generic CRUD app.

## Architecture Overview

- `slow-app/` contains the intentionally inefficient React + TypeScript + Vite implementation.
- `optimized-app/` contains the equivalent user-facing UI with targeted optimizations.
- `benchmark/src/` contains shared deterministic data generation, profiling helpers, theme persistence, debounce behavior, virtualization math, reusable dashboard UI, and shared CSS tokens.
- `e2e/` contains Playwright E2E tests against the generated Pages-like artifact.
- `docs/` contains source benchmark documentation, TypeDoc overview, and manual result templates.
- `site/` is generated output for GitHub Pages and must not be edited by hand.
- `.github/workflows/ci.yml` builds, tests, generates docs/coverage, assembles Pages, runs Playwright, and deploys only from the default branch.

## Coding Standards

- Keep TypeScript strict and explicit around public utility types.
- Prefer small, direct functions over broad abstractions.
- Use deterministic data and deterministic tests.
- Keep UI behavior accessible: labeled controls, keyboard-friendly table scrolling, useful `aria-*` attributes where they describe dynamic state.
- Avoid decorative animation that could distort the performance story.
- Keep visual changes consistent across both apps unless the difference is the performance implementation itself.

## Performance Philosophy

- Slow app problems must be real but not broken.
- Optimized app fixes must be targeted and explainable.
- Do not memoize everything. Use memoization where it protects expensive derivation or high-volume child rendering.
- Keep the slow and optimized apps comparable: same dataset, same controls, same benchmark scenarios.
- Do not remove intentional slow-app bottlenecks to make tests or demos faster.
- Do not add heavyweight dependencies for problems already solved by React, the browser, or a small local utility.

## Testing Requirements

Use Vitest, Testing Library, user-event, and jsdom for unit/component tests. Keep tests focused on behavior rather than React internals.

Unit/component tests should cover:

- app shell rendering
- dark mode persistence
- benchmark controls
- search/filter inputs
- slow app benchmark panel
- optimized app benchmark panel
- optimized virtualization behavior
- lazy chart loading behavior
- profiling helpers
- debounce behavior
- deterministic data generation
- practical accessibility behavior such as keyboard table scrolling

Use Playwright for E2E tests against production builds assembled into `site/`.

Playwright policy:

- Chromium only by default.
- No multi-browser matrix unless there is a strong documented reason.
- Run against the Pages-like artifact under `/frontend-performance-lab/`.
- Use the deterministic `?rows=` E2E override when browser smoke tests need bounded runtime; normal production pages must still default to 20,000 rows.
- Prefer user-visible behavior and benchmark flows.
- Avoid brittle pixel/layout assertions and implementation details.
- Keep `playwright-report/`, `test-results/`, and `blob-report/` out of git.
- Do not publish Playwright reports to GitHub Pages unless explicitly requested and clearly useful.

Run unit tests during normal code changes. Run Playwright when changing app flows, Pages assembly, navigation, theme behavior, accessibility structure, or CI. Run the full `npm run verify` gate before finishing broad changes.

## Documentation Requirements

- Keep `README.md` aligned with runnable commands and Pages output.
- Keep `docs/metrics.md`, `docs/profiling-notes.md`, and `docs/results-before-after.md` usable for manual measurement.
- Keep generated Pages documentation as HTML routes, not fragile raw Markdown links.
- Do not add fake performance numbers.
- Use clear placeholders only where real manual measurement is required.
- TypeDoc should focus on benchmark, profiling, data, theme, debounce, virtualization helpers, benchmark panels, and the optimized virtual table API.

## CI and GitHub Pages Constraints

- Node.js target is `>=24.15.0 <25` locally and `24.x` in CI.
- Use npm and `npm ci`.
- Keep GitHub Actions pins on current stable major versions.
- GitHub Pages artifact is assembled under `site/`.
- Expected Pages structure:
  - `/slow/`
  - `/optimized/`
  - `/coverage/`
  - `/typedoc/`
  - `/docs/`
  - `/docs/metrics/`
  - `/docs/profiling-notes/`
  - `/docs/results-before-after/`
  - `/benchmark/`
- Vite base paths must stay compatible with `https://DanieleMasone.github.io/frontend-performance-lab/`.
- Deploy GitHub Pages only from the repository default branch.

## Dependency Policy

- Use stable versions only.
- Check current stable package metadata before bumping major tooling.
- Avoid experimental libraries unless there is a documented reason.
- Do not add Lighthouse CI, chart libraries, state managers, or CSS frameworks without a clear requirement.

## What Not To Do

- Do not remove the intentional slow-app bottlenecks just to make tests or demos faster.
- Do not make the optimized app visually different to exaggerate improvements.
- Do not commit generated `site/`, coverage, dist, TypeDoc output, Playwright reports, or test result artifacts.
- Do not replace manual result placeholders with invented metrics.
- Do not add broad refactors unrelated to the performance case study.
- Do not add Lighthouse CI unless explicitly requested.

## Commands To Run Before Finishing

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run coverage
npm run build
npm run docs
npm run pages:build
npx playwright install chromium
npm run e2e
npm run verify
```

For smaller changes, run the relevant subset first, then the full gate when the change touches shared utilities, app behavior, docs assembly, CI, or E2E.

## Expected Output Structure

After a successful local artifact build:

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
