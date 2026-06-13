import type { PortfolioRow } from "../../../benchmark/src/data";
import { formatCurrency, formatPercent } from "../../../benchmark/src/data";

interface SlowDataTableProps {
  rows: readonly PortfolioRow[];
  selectedRowIds: readonly string[];
  onRowToggle: (id: string) => void;
}

function HealthBadge({ health }: { health: PortfolioRow["health"] }) {
  return <span className={`health-badge health-${health.toLowerCase()}`}>{health}</span>;
}

export function SlowDataTable({ rows, selectedRowIds, onRowToggle }: SlowDataTableProps) {
  return (
    <section className="panel table-panel" aria-labelledby="slow-table-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Full DOM table</p>
          <h2 id="slow-table-title">Account portfolio</h2>
        </div>
        <span className="table-count">{rows.length.toLocaleString()} rows</span>
      </div>
      <div className="table-scroll" data-table-scroll="slow" tabIndex={0} aria-label="Scrollable full account table">
        <table>
          <thead>
            <tr>
              <th scope="col">Account</th>
              <th scope="col">Owner</th>
              <th scope="col">Region</th>
              <th scope="col">Tier</th>
              <th scope="col">Health</th>
              <th scope="col">ARR</th>
              <th scope="col">Conversion</th>
              <th scope="col">Latency</th>
              <th scope="col">Risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                data-testid="slow-row"
                aria-selected={selectedRowIds.includes(row.id)}
                onClick={() => onRowToggle(row.id)}
              >
                <td>
                  <span className="account-cell">
                    <img src={row.logoUrl} alt="" loading="eager" decoding="sync" />
                    <span>
                      <strong>{row.accountName}</strong>
                      <small>{row.id}</small>
                    </span>
                  </span>
                </td>
                <td>{row.owner}</td>
                <td>{row.region}</td>
                <td>{row.tier}</td>
                <td>
                  <HealthBadge health={row.health} />
                </td>
                <td>{formatCurrency(row.annualContractValue)}</td>
                <td>{formatPercent(row.conversionRate)}</td>
                <td>{row.latencyMs} ms</td>
                <td>{row.riskScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
