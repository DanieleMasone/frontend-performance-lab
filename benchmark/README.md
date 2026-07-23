# Benchmark Protocol

This protocol keeps the slow and optimized apps comparable.

## Scenarios

| Scenario | User flow | Primary signal |
| --- | --- | --- |
| Initial render | Fresh production reload with the default data volume | React commit duration and first visible dashboard state |
| Search/filter interaction | Search for `enterprise`, then change region and tier filters | Browser Performance API measures and React Profiler commits |
| Large table scroll | Scroll the account table from top to deep rows | DOM node count, scroll responsiveness, and visual stability |
| Heavy chart toggle | Open and close the revenue concentration chart | Initial bundle cost, lazy boundary behavior, and interaction duration |
| Image gallery toggle | Hide or reveal the gallery while the table remains populated | Eager versus lazy image loading behavior |
| Production bundle comparison | Run `npm run build` and compare generated assets | Initial JS, lazy chunks, and largest asset |

## Measurement Rules

- Use production builds, not Vite dev mode, for recorded numbers.
- Use the same browser, viewport, data volume, and interaction order for both apps.
- Restore the same starting state before each recorded repetition.
- Record real measurements only. Leave placeholders in [Results Before and After](/frontend-performance-lab/docs/results-before-after/) until manual profiling is complete.
- Keep browser extensions disabled where practical.
- Clear application state before a run if dark mode or search values were changed.

## Default Test Inputs

| Input | Value |
| --- | --- |
| Rows | 20,000 |
| Search query | `enterprise` |
| Region filter | `North America` |
| Tier filter | `Enterprise` |
| Sort | Risk score descending |
| Browser URL | `https://DanieleMasone.github.io/frontend-performance-lab/` |

For local setup, artifact generation, and the complete validation workflow, use the [User Guide](/frontend-performance-lab/docs/user-guide/).
