# Profiling Notes

## Instrumentation

Both apps use the same shared profiling helpers:

- `React.Profiler` records commit count, actual render duration, base duration, start time, and commit time.
- `performance.mark()` and `performance.measure()` wrap benchmark interactions.
- The benchmark panels display recent profiler and interaction data.
- Table row counts are shown so DOM pressure is visible during comparison.

## Slow App Notes

The slow implementation intentionally keeps several common problems:

- filtering and sorting are recalculated on every render
- derived KPI summary data is recalculated on every render
- the full filtered row set is rendered into the DOM
- row callbacks are unstable
- table selection state lives at the top of the app
- gallery images use eager loading and sync decoding
- the heavy chart module is imported into the initial bundle

These issues are deliberate. Fixing them in `slow-app/` weakens the comparison.

## Optimized App Notes

The optimized implementation makes targeted changes:

- filtering and sorting are memoized against stable filter inputs
- KPI summary data is memoized from filtered rows
- search uses a short debounce before applying expensive filtering
- the table uses manual virtualization
- row selection state is local to the table
- high-volume rows are wrapped in `React.memo`
- image loading is lazy and async
- the heavy chart is loaded with `React.lazy` and `Suspense`

Memoization is intentionally limited to high-impact paths.

## Manual Browser Profiling Flow

Use the [User Guide benchmark workflow](/frontend-performance-lab/docs/user-guide/#benchmark-workflow) for the end-to-end review flow. The [Benchmark Protocol](/frontend-performance-lab/benchmark/) remains the source of truth for scenarios, fixed inputs, and measurement rules.

## Browser DevTools Checks

Recommended manual checks:

- React Profiler flamegraph for search/filter interaction
- Performance panel for table scroll
- Network panel for initial JS and lazy chart chunk
- Elements panel for row count difference
- Coverage report for test coverage, not runtime code coverage

## Known Limits

- Source-level marks do not replace a full browser trace.
- JSDOM tests validate behavior, not real rendering performance.
- Data is synthetic, deterministic, and designed for repeatability.
