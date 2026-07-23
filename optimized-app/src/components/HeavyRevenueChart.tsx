import { useMemo } from "react";
import type { PortfolioRow } from "../../../benchmark/src/data";
import { buildRevenueChartSeries, formatCurrency } from "../../../benchmark/src/data";

interface HeavyRevenueChartProps {
  rows: readonly PortfolioRow[];
}

export default function HeavyRevenueChart({ rows }: HeavyRevenueChartProps) {
  const series = useMemo(() => buildRevenueChartSeries(rows), [rows]);

  return (
    <section className="panel chart-panel" data-testid="optimized-heavy-chart" aria-labelledby="optimized-chart-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Lazy module</p>
          <h2 id="optimized-chart-title">Revenue concentration</h2>
        </div>
      </div>
      <ul className="bar-chart" aria-label="Revenue by account health">
        {series.map((bucket) => (
          <li className="bar-row" key={bucket.label}>
            <span>{bucket.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${bucket.percent}%`, background: bucket.color }} />
            </div>
            <strong>{formatCurrency(bucket.value)}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
