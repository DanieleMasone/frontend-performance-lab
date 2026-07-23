import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import type { PortfolioRow } from "../../../benchmark/src/data";
import { formatCurrency, formatPercent } from "../../../benchmark/src/data";
import { calculateVirtualWindow } from "../../../benchmark/src/virtualization";

interface VirtualizedDataTableProps {
  rows: readonly PortfolioRow[];
  onVisibleRowsChange: (count: number) => void;
}

interface VirtualRowProps {
  row: PortfolioRow;
  selected: boolean;
  rowIndex: number;
  onToggle: (id: string) => void;
}

const ROW_HEIGHT = 58;
const VIEWPORT_HEIGHT = 580;

function HealthBadge({ health }: { health: PortfolioRow["health"] }) {
  return <span className={`health-badge health-${health.toLowerCase()}`}>{health}</span>;
}

const VirtualRow = memo(function VirtualRow({ row, selected, rowIndex, onToggle }: VirtualRowProps) {
  return (
    <div
      className="virtual-row"
      role="row"
      aria-rowindex={rowIndex}
      aria-selected={selected}
      data-testid="optimized-row"
      onClick={() => onToggle(row.id)}
    >
      <div className="virtual-cell account-cell" role="cell">
        <img src={row.logoUrl} alt="" loading="lazy" decoding="async" />
        <span>
          <strong>{row.accountName}</strong>
          <small>{row.id}</small>
        </span>
      </div>
      <div className="virtual-cell" role="cell">{row.owner}</div>
      <div className="virtual-cell" role="cell">{row.region}</div>
      <div className="virtual-cell" role="cell">{row.tier}</div>
      <div className="virtual-cell" role="cell">
        <HealthBadge health={row.health} />
      </div>
      <div className="virtual-cell" role="cell">{formatCurrency(row.annualContractValue)}</div>
      <div className="virtual-cell" role="cell">{formatPercent(row.conversionRate)}</div>
      <div className="virtual-cell" role="cell">{row.latencyMs} ms</div>
      <div className="virtual-cell" role="cell">{row.riskScore}</div>
    </div>
  );
});

export function VirtualizedDataTable({ rows, onVisibleRowsChange }: VirtualizedDataTableProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(() => new Set());

  const virtualWindow = useMemo(
    () =>
      calculateVirtualWindow({
        itemCount: rows.length,
        rowHeight: ROW_HEIGHT,
        viewportHeight: VIEWPORT_HEIGHT,
        scrollTop,
        overscan: 8
      }),
    [rows.length, scrollTop]
  );

  const visibleRows = useMemo(
    () => rows.slice(virtualWindow.startIndex, virtualWindow.endIndex),
    [rows, virtualWindow.endIndex, virtualWindow.startIndex]
  );

  useEffect(() => {
    onVisibleRowsChange(virtualWindow.visibleCount);
  }, [onVisibleRowsChange, virtualWindow.visibleCount]);

  const toggleRow = useCallback((id: string) => {
    setSelectedRowIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.currentTarget;

    if (event.key === "PageDown") {
      target.scrollTop += VIEWPORT_HEIGHT;
      event.preventDefault();
    }

    if (event.key === "PageUp") {
      target.scrollTop -= VIEWPORT_HEIGHT;
      event.preventDefault();
    }

    if (event.key === "Home") {
      target.scrollTop = 0;
      event.preventDefault();
    }

    if (event.key === "End") {
      target.scrollTop = rows.length * ROW_HEIGHT;
      event.preventDefault();
    }
  }, [rows.length]);

  return (
    <section className="panel table-panel" aria-labelledby="optimized-table-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Virtualized table</p>
          <h2 id="optimized-table-title">Account portfolio</h2>
        </div>
        <span className="table-count">{rows.length.toLocaleString()} rows</span>
      </div>

      <div className="virtual-table" role="table" aria-label="Account portfolio" aria-rowcount={rows.length + 1}>
        <div className="virtual-header" role="rowgroup">
          <div className="virtual-row virtual-heading-row" role="row" aria-rowindex={1}>
            <div className="virtual-cell" role="columnheader">Account</div>
            <div className="virtual-cell" role="columnheader">Owner</div>
            <div className="virtual-cell" role="columnheader">Region</div>
            <div className="virtual-cell" role="columnheader">Tier</div>
            <div className="virtual-cell" role="columnheader">Health</div>
            <div className="virtual-cell" role="columnheader">ARR</div>
            <div className="virtual-cell" role="columnheader">Conversion</div>
            <div className="virtual-cell" role="columnheader">Latency</div>
            <div className="virtual-cell" role="columnheader">Risk</div>
          </div>
        </div>
        <div
          className="virtual-scroll"
          data-table-scroll="optimized"
          style={{ height: VIEWPORT_HEIGHT }}
          tabIndex={0}
          role="rowgroup"
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          onKeyDown={handleKeyDown}
        >
          <div className="virtual-spacer" style={{ height: virtualWindow.totalHeight }}>
            <div className="virtual-window" style={{ transform: `translateY(${virtualWindow.offsetTop}px)` }}>
              {visibleRows.map((row, index) => (
                <VirtualRow
                  key={row.id}
                  row={row}
                  rowIndex={virtualWindow.startIndex + index + 2}
                  selected={selectedRowIds.has(row.id)}
                  onToggle={toggleRow}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
