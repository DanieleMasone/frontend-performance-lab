export const DATASET_SIZE = 20_000;

export type AccountTier = "Enterprise" | "Scale" | "Growth" | "Startup";
export type Region = "North America" | "EMEA" | "APAC" | "LATAM";
export type SortDirection = "asc" | "desc";
export type SortKey = "riskScore" | "annualContractValue" | "latencyMs" | "conversionRate";

export interface PortfolioRow {
  id: string;
  accountName: string;
  owner: string;
  region: Region;
  tier: AccountTier;
  health: "Healthy" | "Watch" | "Critical";
  annualContractValue: number;
  sessions: number;
  conversionRate: number;
  latencyMs: number;
  riskScore: number;
  tags: string[];
  logoUrl: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  alt: string;
  src: string;
}

export interface FilterState {
  query: string;
  region: Region | "all";
  tier: AccountTier | "all";
  sortKey: SortKey;
  sortDirection: SortDirection;
}

export interface PortfolioSummary {
  visibleAccounts: number;
  annualRecurringRevenue: number;
  averageConversionRate: number;
  averageLatencyMs: number;
  criticalAccounts: number;
  weightedRiskScore: number;
}

export interface RevenueChartBucket {
  label: PortfolioRow["health"];
  value: number;
  color: string;
  percent: number;
}

export const REGIONS: readonly Region[] = ["North America", "EMEA", "APAC", "LATAM"];
export const TIERS: readonly AccountTier[] = ["Enterprise", "Scale", "Growth", "Startup"];
export const SORT_OPTIONS: readonly { label: string; value: SortKey }[] = [
  { label: "Risk score", value: "riskScore" },
  { label: "Annual contract value", value: "annualContractValue" },
  { label: "Latency", value: "latencyMs" },
  { label: "Conversion", value: "conversionRate" }
];

const owners = [
  "Ava Chen",
  "Maya Singh",
  "Noah Rossi",
  "Elena Garcia",
  "Theo Brooks",
  "Lina Novak",
  "Sam Taylor",
  "Iris Martin"
] as const;

const accountPrefixes = [
  "Northstar",
  "Helio",
  "Keystone",
  "Summit",
  "Atlas",
  "Nimble",
  "Quartz",
  "Vertex",
  "Signal",
  "Meridian"
] as const;

const accountSuffixes = [
  "Analytics",
  "Commerce",
  "Systems",
  "Cloud",
  "Logistics",
  "Finance",
  "Health",
  "Operations",
  "Platform",
  "Security"
] as const;

const swatches = [
  "#2f80ed",
  "#00a896",
  "#f59f00",
  "#ef476f",
  "#7c3aed",
  "#118ab2",
  "#06d6a0",
  "#f97316"
] as const;

function seededUnit(index: number, salt: number): number {
  const raw = Math.sin(index * 12.9898 + salt * 78.233) * 43_758.5453;
  return raw - Math.floor(raw);
}

function pick<T>(items: readonly T[], index: number, salt: number): T {
  return items[Math.floor(seededUnit(index, salt) * items.length) % items.length];
}

function createLogoDataUri(label: string, color: string): string {
  const initials = label
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
<rect width="96" height="96" rx="18" fill="${color}"/>
<circle cx="72" cy="20" r="16" fill="rgba(255,255,255,0.22)"/>
<text x="48" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#fff">${initials}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createGalleryDataUri(index: number, color: string): string {
  const accent = swatches[(index + 3) % swatches.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
<rect width="640" height="360" fill="${color}"/>
<rect x="36" y="36" width="568" height="288" rx="24" fill="rgba(255,255,255,0.14)"/>
<path d="M84 250 C150 160 210 170 272 226 C318 266 380 208 436 138 C480 84 532 88 580 128 L580 304 L84 304 Z" fill="${accent}" opacity="0.72"/>
<circle cx="${120 + index * 17}" cy="96" r="42" fill="rgba(255,255,255,0.28)"/>
<text x="52" y="78" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#fff">Scenario ${index + 1}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function generatePortfolioRows(count = DATASET_SIZE): PortfolioRow[] {
  return Array.from({ length: count }, (_, index) => {
    const tier = pick(TIERS, index, 1);
    const region = pick(REGIONS, index, 2);
    const prefix = accountPrefixes[index % accountPrefixes.length];
    const suffix = accountSuffixes[Math.floor(index / accountPrefixes.length) % accountSuffixes.length];
    const enterpriseLabel = index % 8 === 0 ? "Enterprise" : tier;
    const accountName = `${prefix} ${enterpriseLabel} ${suffix} ${String(index + 1).padStart(5, "0")}`;
    const monthlyRevenue = Math.round(8_000 + seededUnit(index, 3) * 180_000);
    const annualContractValue = monthlyRevenue * 12 + Math.round(seededUnit(index, 4) * 60_000);
    const latencyMs = Math.round(90 + seededUnit(index, 5) * 1_150);
    const riskScore = Math.round(10 + seededUnit(index, 6) * 90);
    const conversionRate = Number((0.02 + seededUnit(index, 7) * 0.31).toFixed(3));
    const health = riskScore > 72 ? "Critical" : riskScore > 45 ? "Watch" : "Healthy";
    const swatch = swatches[index % swatches.length];

    return {
      id: `acct-${index + 1}`,
      accountName,
      owner: pick(owners, index, 8),
      region,
      tier,
      health,
      annualContractValue,
      sessions: Math.round(900 + seededUnit(index, 9) * 240_000),
      conversionRate,
      latencyMs,
      riskScore,
      tags: [
        enterpriseLabel.toLowerCase(),
        region.toLowerCase().replace(" ", "-"),
        health.toLowerCase()
      ],
      logoUrl: createLogoDataUri(accountName, swatch)
    };
  });
}

export function createGalleryImages(count = 10): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => {
    const dominantColor = swatches[index % swatches.length];

    return {
      id: `gallery-${index + 1}`,
      title: `Benchmark capture ${index + 1}`,
      alt: `Synthetic benchmark capture ${index + 1}`,
      src: createGalleryDataUri(index, dominantColor)
    };
  });
}

export function buildRevenueChartSeries(rows: readonly PortfolioRow[]): RevenueChartBucket[] {
  const buckets: RevenueChartBucket[] = [
    { label: "Healthy", value: 0, color: "#00a896", percent: 0 },
    { label: "Watch", value: 0, color: "#f59f00", percent: 0 },
    { label: "Critical", value: 0, color: "#ef476f", percent: 0 }
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

export function expensiveRowScore(row: PortfolioRow): number {
  let score = row.riskScore * 1.7 + row.latencyMs * 0.08 + row.conversionRate * 100;

  for (let index = 0; index < 24; index += 1) {
    score = Math.sqrt(score * 997 + row.sessions * (index + 1)) % 10_000;
  }

  return score;
}

export function filterAndSortRows(rows: readonly PortfolioRow[], filters: FilterState): PortfolioRow[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = rows.filter((row) => {
    if (filters.region !== "all" && row.region !== filters.region) {
      return false;
    }

    if (filters.tier !== "all" && row.tier !== filters.tier) {
      return false;
    }

    const haystack = `${row.accountName} ${row.owner} ${row.region} ${row.tier} ${row.health} ${row.tags.join(" ")}`.toLowerCase();
    const weightedScore = expensiveRowScore(row);

    return query.length === 0 || haystack.includes(query) || String(Math.round(weightedScore)).includes(query);
  });

  const direction = filters.sortDirection === "asc" ? 1 : -1;

  return filtered.sort((left, right) => {
    const leftValue = left[filters.sortKey];
    const rightValue = right[filters.sortKey];
    return (leftValue - rightValue) * direction;
  });
}

export function calculateSummary(rows: readonly PortfolioRow[]): PortfolioSummary {
  if (rows.length === 0) {
    return {
      visibleAccounts: 0,
      annualRecurringRevenue: 0,
      averageConversionRate: 0,
      averageLatencyMs: 0,
      criticalAccounts: 0,
      weightedRiskScore: 0
    };
  }

  const totals = rows.reduce(
    (accumulator, row) => {
      accumulator.annualRecurringRevenue += row.annualContractValue;
      accumulator.conversionRate += row.conversionRate;
      accumulator.latencyMs += row.latencyMs;
      accumulator.riskScore += row.riskScore * row.annualContractValue;
      accumulator.weight += row.annualContractValue;

      if (row.health === "Critical") {
        accumulator.criticalAccounts += 1;
      }

      return accumulator;
    },
    {
      annualRecurringRevenue: 0,
      conversionRate: 0,
      latencyMs: 0,
      riskScore: 0,
      weight: 0,
      criticalAccounts: 0
    }
  );

  return {
    visibleAccounts: rows.length,
    annualRecurringRevenue: totals.annualRecurringRevenue,
    averageConversionRate: totals.conversionRate / rows.length,
    averageLatencyMs: Math.round(totals.latencyMs / rows.length),
    criticalAccounts: totals.criticalAccounts,
    weightedRiskScore: totals.weight === 0 ? 0 : Math.round(totals.riskScore / totals.weight)
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: value > 999_999 ? "compact" : "standard"
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1
  }).format(value);
}
