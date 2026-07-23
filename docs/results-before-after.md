# Results Before and After

All values below must be filled from real manual measurements. Do not replace placeholders with estimates. Use the [Benchmark Protocol](/frontend-performance-lab/benchmark/) for comparable scenarios and [Metrics](/frontend-performance-lab/docs/metrics/) for field definitions.

## Test Environment

| Field | Value |
| --- | --- |
| Measurement date | Manual measurement pending |
| Browser | Manual measurement pending |
| Browser version | Manual measurement pending |
| Operating system | Manual measurement pending |
| Hardware | Manual measurement pending |
| Viewport | Manual measurement pending |
| Dataset size | 20,000 rows |
| Build command | `npm run build` |
| Artifact command | `npm run pages:build` |

## Runtime Results

| Scenario | Slow app | Optimized app | Delta | Improvement | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Initial render actual duration | Manual measurement pending | Manual measurement pending | Manual measurement pending | Manual measurement pending | Use benchmark panel after fresh load |
| Search/filter interaction | Manual measurement pending | Manual measurement pending | Manual measurement pending | Manual measurement pending | Search query: `enterprise` |
| Large table scroll | Manual measurement pending | Manual measurement pending | Manual measurement pending | Manual measurement pending | Compare DOM rows and scroll responsiveness |
| Heavy chart toggle | Manual measurement pending | Manual measurement pending | Manual measurement pending | Manual measurement pending | Slow bundle imports chart upfront; optimized lazy-loads |
| Image gallery toggle | Manual measurement pending | Manual measurement pending | Manual measurement pending | Manual measurement pending | Slow eager images; optimized lazy images |

## Bundle Results

| Asset metric | Slow app | Optimized app | Delta | Notes |
| --- | ---: | ---: | ---: | --- |
| Initial JS total | Manual measurement pending | Manual measurement pending | Manual measurement pending | Use Vite output and browser Network panel |
| Largest initial chunk | Manual measurement pending | Manual measurement pending | Manual measurement pending | Optimized app should split chart chunk |
| Lazy chart chunk | Not applicable | Manual measurement pending | Manual measurement pending | Record emitted chart chunk size |
| CSS total | Manual measurement pending | Manual measurement pending | Manual measurement pending | Shared visual language should remain comparable |

## Interpretation

| Finding | Evidence | Trade-off |
| --- | --- | --- |
| Manual measurement pending | Manual measurement pending | Manual measurement pending |

## Sign-Off Checklist

- [ ] Slow app measured in production mode
- [ ] Optimized app measured in production mode
- [ ] Same browser and viewport used for both
- [ ] Same scenario order used for both
- [ ] Bundle sizes recorded from production output
- [ ] Notes include trade-offs, not only wins
