# Frontend Performance Engineering Lab

A practical React + TypeScript performance engineering project that compares an intentionally slow frontend implementation with an optimized version of the same user interface.

The goal is not to showcase another generic CRUD app.  
The goal is to demonstrate how frontend performance problems are identified, measured, explained, and improved.

---

## Project Purpose

Many frontend developers talk about performance.  
This repository focuses on measurable performance work:

- render cost
- commit duration
- expensive derived state
- large list rendering
- unnecessary re-renders
- bundle size
- lazy loading
- image loading strategy
- profiling evidence
- before/after comparison

---

## Repository Structure

```txt
frontend-performance-lab/
├─ slow-app/
│  └─ intentionally inefficient React implementation
├─ optimized-app/
│  └─ optimized React implementation with the same functional behavior
├─ benchmark/
│  └─ benchmark notes and reproducible scenarios
└─ docs/
   ├─ metrics.md
   ├─ profiling-notes.md
   └─ results-before-after.md
```

---

## Tech Stack

- React
- TypeScript
- Vite
- Native React Profiler API
- Browser Performance API
- WebStorm run/debug configurations
- Node.js 24.x

No global performance tooling is required.  
The project relies on source-level instrumentation, production builds, browser runtime metrics, and IDE-supported workflows.

---

## What This Project Demonstrates

### Slow App

The slow version intentionally includes common frontend performance issues:

- large data set rendered without virtualization
- expensive filtering and sorting on every render
- unnecessary component re-renders
- unstable callback references
- heavy component included in the initial bundle
- eager image loading
- derived state calculated repeatedly
- excessive state ownership in top-level components

### Optimized App

The optimized version keeps the same user-facing behavior but improves the implementation using:

- memoized derived data
- component memoization where it has measurable value
- stable callbacks for expensive child trees
- manual list virtualization
- lazy-loaded heavy UI sections
- native lazy image loading
- better state locality
- reduced initial bundle cost

---

## Performance Scenarios

The benchmark page covers the following scenarios:

| Scenario | Purpose |
|---|---|
| Initial render | Measures first render cost with a large UI tree |
| Search interaction | Measures filtering/sorting responsiveness |
| Large table scroll | Measures rendering strategy under list pressure |
| Heavy chart toggle | Measures lazy loading and deferred execution |
| Image gallery load | Measures asset loading strategy |
| Production build comparison | Measures bundle output differences |

---

## Metrics Collected

| Metric | Source |
|---|---|
| React actual render duration | React Profiler API |
| React base render duration | React Profiler API |
| Commit count | React Profiler API |
| Search interaction duration | Browser Performance API |
| Bundle size | Vite production build output |
| Largest chunk | Vite build assets |
| Rows rendered | Application benchmark panel |
| Before/after delta | Manual benchmark documentation |

---

## Running the Project

### Slow App

```bash
cd slow-app
npm install
npm run dev
```

### Optimized App

```bash
cd optimized-app
npm install
npm run dev
```

---

## Building for Production

```bash
cd slow-app
npm run build
```

```bash
cd optimized-app
npm run build
```

Production builds are used to compare bundle size and chunking behavior.

---

## Benchmark Methodology

Each scenario should be measured in both applications using the same data volume and the same interaction flow.

Recommended baseline:

```txt
Rows: 20,000
Search query: "enterprise"
Chart: enabled
Image gallery: enabled
Build mode: production
Browser state: fresh reload
```

For each scenario, record:

```txt
- slow app result
- optimized app result
- absolute improvement
- percentage improvement
- optimization applied
- trade-off introduced
```

---

## Example Results Table

| Area | Slow App | Optimized App | Improvement | Optimization |
|---|---:|---:|---:|---|
| Initial render | TBD | TBD | TBD | Memoization + reduced initial work |
| Search interaction | TBD | TBD | TBD | useMemo + debounced input |
| Table rendering | TBD | TBD | TBD | Manual virtualization |
| Initial JS bundle | TBD | TBD | TBD | Lazy loading |
| Image loading | TBD | TBD | TBD | Native lazy loading |

---

## Trade-offs

This project intentionally documents trade-offs instead of presenting performance work as free optimization.

| Optimization | Benefit | Trade-off |
|---|---|---|
| Memoization | Reduces repeated computation | Adds dependency management complexity |
| React.memo | Avoids unnecessary child renders | Can hide poor state design if overused |
| Virtualization | Reduces DOM pressure | Adds scroll and accessibility complexity |
| Lazy loading | Improves initial bundle cost | Can delay later interactions |
| Debouncing | Reduces repeated work | Adds perceived latency if overdone |
| Image lazy loading | Reduces initial network pressure | Needs layout stability management |

---

## Why This Repository Exists

Frontend performance is often discussed abstractly.

This project shows performance engineering as a concrete process:

1. create a reproducible bottleneck
2. measure it
3. explain the root cause
4. apply a targeted optimization
5. measure again
6. document the trade-off

The point is not to make synthetic numbers look good.  
The point is to demonstrate senior-level engineering judgment around frontend performance.

---

## Suggested Review Path

For reviewers:

1. Start with `slow-app`
2. Run the benchmark scenarios
3. Review profiler output
4. Open `optimized-app`
5. Run the same scenarios
6. Compare `docs/results-before-after.md`
7. Review the trade-off documentation

---

## Status

This repository is designed as a portfolio-grade performance engineering case study.

Current focus:

- React render performance
- large list rendering
- bundle splitting
- runtime instrumentation
- benchmark documentation

Future extensions may include:

- SSR/CSR comparison
- hydration cost analysis
- Core Web Vitals collection
- automated benchmark snapshots
- CI performance budget checks
