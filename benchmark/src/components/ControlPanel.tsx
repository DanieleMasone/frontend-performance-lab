import type { ChangeEvent } from "react";
import type {
  AccountTier,
  FilterState,
  Region,
  SortDirection,
  SortKey
} from "../data";
import { REGIONS, SORT_OPTIONS, TIERS } from "../data";
import type { ThemeMode } from "../usePersistentTheme";

export interface ControlPanelProps {
  filters: FilterState;
  appliedQuery?: string;
  theme: ThemeMode;
  onQueryChange: (value: string) => void;
  onRegionChange: (value: Region | "all") => void;
  onTierChange: (value: AccountTier | "all") => void;
  onSortKeyChange: (value: SortKey) => void;
  onSortDirectionChange: (value: SortDirection) => void;
  onThemeToggle: () => void;
}

export function ControlPanel({
  filters,
  appliedQuery,
  theme,
  onQueryChange,
  onRegionChange,
  onTierChange,
  onSortKeyChange,
  onSortDirectionChange,
  onThemeToggle
}: ControlPanelProps) {
  const describedBy = appliedQuery === undefined ? undefined : "applied-query";

  return (
    <section className="panel controls-panel" aria-label="Dashboard controls">
      <label className="field search-field">
        <span>Search</span>
        <input
          type="search"
          value={filters.query}
          placeholder="Search account, owner, region, tier"
          aria-describedby={describedBy}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Region</span>
        <select value={filters.region} onChange={(event) => onRegionChange(event.target.value as Region | "all")}>
          <option value="all">All regions</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Tier</span>
        <select value={filters.tier} onChange={(event) => onTierChange(event.target.value as AccountTier | "all")}>
          <option value="all">All tiers</option>
          {TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort</span>
        <select value={filters.sortKey} onChange={(event) => onSortKeyChange(event.target.value as SortKey)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field compact-field">
        <span>Order</span>
        <select
          value={filters.sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value as SortDirection)}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </label>

      <button className="toggle-button" type="button" aria-pressed={theme === "dark"} onClick={onThemeToggle}>
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>

      {appliedQuery === undefined ? null : (
        <span id="applied-query" className="visually-hidden">
          Applied search query: {appliedQuery || "empty"}
        </span>
      )}
    </section>
  );
}
