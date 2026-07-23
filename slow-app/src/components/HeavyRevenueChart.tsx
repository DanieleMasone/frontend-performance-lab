import type { PortfolioRow } from "../../../benchmark/src/data";
import { buildRevenueChartSeries, formatCurrency } from "../../../benchmark/src/data";

interface HeavyRevenueChartProps {
  rows: readonly PortfolioRow[];
}

export default function HeavyRevenueChart({ rows }: HeavyRevenueChartProps) {
  const series = buildRevenueChartSeries(rows);

  return (
    <section className="panel chart-panel" data-testid="slow-heavy-chart" aria-labelledby="slow-chart-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Upfront module</p>
          <h2 id="slow-chart-title">Revenue concentration</h2>
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
