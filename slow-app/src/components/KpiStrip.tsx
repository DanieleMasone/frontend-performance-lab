import type { PortfolioSummary } from "../../../benchmark/src/data";
import { formatCurrency, formatPercent } from "../../../benchmark/src/data";

interface KpiStripProps {
  summary: PortfolioSummary;
}

export function KpiStrip({ summary }: KpiStripProps) {
  return (
    <section className="kpi-strip" aria-label="Portfolio summary">
      <article>
        <span>Visible accounts</span>
        <strong>{summary.visibleAccounts.toLocaleString()}</strong>
      </article>
      <article>
        <span>ARR</span>
        <strong>{formatCurrency(summary.annualRecurringRevenue)}</strong>
      </article>
      <article>
        <span>Conversion</span>
        <strong>{formatPercent(summary.averageConversionRate)}</strong>
      </article>
      <article>
        <span>Avg latency</span>
        <strong>{summary.averageLatencyMs.toLocaleString()} ms</strong>
      </article>
      <article>
        <span>Critical</span>
        <strong>{summary.criticalAccounts.toLocaleString()}</strong>
      </article>
      <article>
        <span>Weighted risk</span>
        <strong>{summary.weightedRiskScore}</strong>
      </article>
    </section>
  );
}
