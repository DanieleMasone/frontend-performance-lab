# AGENTS.md

## Project Purpose

`frontend-performance-lab` is a portfolio-grade frontend performance engineering repository. It compares an intentionally slow React dashboard with an optimized version of the same UI and benchmark scenarios.

The goal is to demonstrate measurement, diagnosis, targeted optimization, and documentation. Do not turn this into a generic CRUD app.

## Architecture Overview

- `slow-app/` contains the intentionally inefficient React + TypeScript + Vite implementation.
- `optimized-app/` contains the equivalent user-facing UI with targeted optimizations.
- `benchmark/src/` contains shared deterministic data generation, profiling helpers, theme persistence, debounce behavior, and virtualization math.
- `docs/` contains source benchmark documentation and manual result templates.
- `site/` is generated output for GitHub Pages and must not be edited by hand.
- `.github/workflows/ci.yml` builds, tests, generates docs/coverage, assembles Pages, and deploys only from the default branch.

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
- Do not add heavyweight dependencies for problems already solved by React, the browser, or a small local utility.

## Testing Requirements

Tests should cover:

- app shell rendering
- dark mode persistence
- benchmark controls
- search/filter inputs
- slow app benchmark panel
- optimized app benchmark panel
- optimized virtualization behavior
- lazy chart loading behavior
- practical accessibility behavior such as keyboard table scrolling

Use Vitest, Testing Library, user-event, and jsdom. Keep tests focused on behavior.

## Documentation Requirements

- Keep `README.md` aligned with runnable commands and Pages output.
- Keep `docs/metrics.md`, `docs/profiling-notes.md`, and `docs/results-before-after.md` usable for manual measurement.
- Do not add fake performance numbers.
- Use clear placeholders only where real manual measurement is required.
- TypeDoc should focus on benchmark, profiling, data, theme, debounce, and virtualization helpers.

## CI and GitHub Pages Constraints

- Node.js target is 24.15.0 locally and `24.x` in CI.
- Use npm and `npm ci`.
- Keep GitHub Actions pins on current stable major versions.
- GitHub Pages artifact is assembled under `site/`.
- Expected Pages structure:
  - `/slow/`
  - `/optimized/`
  - `/coverage/`
  - `/typedoc/`
  - `/docs/`
  - `/benchmark/`
- Vite base paths must stay compatible with `https://DanieleMasone.github.io/frontend-performance-lab/`.

## Dependency Policy

- Use stable versions only.
- Check current stable package metadata before bumping major tooling.
- Avoid experimental libraries unless there is a documented reason.
- Do not add Playwright, Lighthouse CI, chart libraries, state managers, or CSS frameworks without a clear requirement.

## What Not To Do

- Do not remove the intentional slow-app bottlenecks just to make tests or demos faster.
- Do not make the optimized app visually different to exaggerate improvements.
- Do not commit generated `site/`, coverage, dist, or TypeDoc output.
- Do not replace manual result placeholders with invented metrics.
- Do not add broad refactors unrelated to the performance case study.

## Commands To Run Before Finishing

```bash
npm ci
npm run typecheck
npm run test
npm run coverage
npm run build
npm run docs
npm run pages:build
```

Run `npm run lint` as well whenever linting is configured or edited.

## Expected Output Structure

After a successful local artifact build:

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
