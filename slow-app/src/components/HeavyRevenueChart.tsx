import type { PortfolioRow } from "../../../benchmark/src/data";
import { formatCurrency } from "../../../benchmark/src/data";

interface HeavyRevenueChartProps {
  rows: readonly PortfolioRow[];
}

function buildChartSeries(rows: readonly PortfolioRow[]) {
  const buckets = [
    { label: "Healthy", value: 0, color: "#00a896" },
    { label: "Watch", value: 0, color: "#f59f00" },
    { label: "Critical", value: 0, color: "#ef476f" }
  ];

  for (const row of rows) {
    const target = row.health === "Healthy" ? buckets[0] : row.health === "Watch" ? buckets[1] : buckets[2];
    let adjusted = row.annualContractValue;

    for (let index = 0; index < 40; index += 1) {
      adjusted = Math.sqrt(adjusted * 1.17 + row.riskScore * index) * 94;
    }

    target.value += adjusted;
  }

  const largest = Math.max(...buckets.map((bucket) => bucket.value), 1);

  return buckets.map((bucket) => ({
    ...bucket,
    percent: Math.max(4, (bucket.value / largest) * 100)
  }));
}

export default function HeavyRevenueChart({ rows }: HeavyRevenueChartProps) {
  const series = buildChartSeries(rows);

  return (
    <section className="panel chart-panel" data-testid="slow-heavy-chart" aria-labelledby="slow-chart-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Upfront module</p>
          <h2 id="slow-chart-title">Revenue concentration</h2>
        </div>
      </div>
      <div className="bar-chart" role="img" aria-label="Revenue by account health">
        {series.map((bucket) => (
          <div className="bar-row" key={bucket.label}>
            <span>{bucket.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${bucket.percent}%`, background: bucket.color }} />
            </div>
            <strong>{formatCurrency(bucket.value)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
