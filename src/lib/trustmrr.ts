// ---------------------------------------------------------------------------
// TrustMRR API — types, fetcher, and formatting helpers
// ---------------------------------------------------------------------------

const TRUSTMRR_BASE = "https://trustmrr.com/api/v1/startups";

// ---- Types ----------------------------------------------------------------

export interface TrustMRRRevenue {
  last30Days: number;
  mrr: number;
  total: number;
}

export interface TrustMRRTechItem {
  slug: string;
  category: string;
}

export interface TrustMRRCofounder {
  xHandle: string;
  xName: string | null;
}

/** Full response shape from GET /api/v1/startups/{slug} → data */
export interface TrustMRRStartup {
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  website: string | null;
  country: string | null;
  foundedDate: string | null;
  category: string | null;
  paymentProvider: string;
  targetAudience: string | null;
  revenue: TrustMRRRevenue;
  customers: number;
  activeSubscriptions: number;
  askingPrice: number | null;
  profitMarginLast30Days: number | null;
  growth30d: number | null;
  multiple: number | null;
  onSale: boolean;
  firstListedForSaleAt: string | null;
  xHandle: string | null;
  xFollowerCount: number | null;
  isMerchantOfRecord: boolean;
  techStack: TrustMRRTechItem[];
  cofounders: TrustMRRCofounder[];
}

/** Minimal subset used by the TrustCard widget */
export interface TrustCardData {
  name: string;
  slug: string;
  icon: string | null;
  mrr: number;
  mrrFormatted: string;
  growth30d: number | null;
  growthFormatted: string;
  activeSubscriptions: number;
  paymentProvider: string;
}

// ---- Fetcher --------------------------------------------------------------

export class TrustMRRError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "TrustMRRError";
  }
}

/**
 * Fetch a startup from the TrustMRR API (server-side only).
 * Throws TrustMRRError on non-200 responses.
 */
export async function fetchStartup(slug: string): Promise<TrustMRRStartup> {
  const apiKey = process.env.TRUSTMRR_API_KEY;
  if (!apiKey) {
    throw new TrustMRRError("TRUSTMRR_API_KEY is not configured", 500);
  }

  const res = await fetch(`${TRUSTMRR_BASE}/${encodeURIComponent(slug)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      (body as { error?: string }).error ?? `TrustMRR API returned ${res.status}`;
    throw new TrustMRRError(msg, res.status);
  }

  const json = (await res.json()) as { data: TrustMRRStartup };
  return json.data;
}

/**
 * Fetch a startup and return only the fields needed for TrustCard rendering.
 */
export async function fetchTrustCardData(
  slug: string,
): Promise<TrustCardData> {
  const startup = await fetchStartup(slug);
  const mrrCents = normalizeMrrToCents(startup.revenue.mrr);

  return {
    name: startup.name,
    slug: startup.slug,
    icon: startup.icon,
    mrr: mrrCents,
    mrrFormatted: formatCents(mrrCents),
    growth30d: startup.growth30d,
    growthFormatted: formatGrowth(startup.growth30d),
    activeSubscriptions: startup.activeSubscriptions,
    paymentProvider: startup.paymentProvider,
  };
}

// ---- Metal tier -----------------------------------------------------------

export type MetalTier = "bronze" | "silver" | "gold" | "platinum";

/** Map MRR (in cents) to a metal finish for the TrustCard */
export function getMetalTier(mrrCents: number): MetalTier {
  const dollars = mrrCents / 100;
  if (dollars >= 10_000) return "platinum";
  if (dollars >= 2_500) return "gold";
  if (dollars >= 500) return "silver";
  return "bronze";
}

// ---- Formatting helpers ---------------------------------------------------

/**
 * Normalize MRR from API to a consistent "cents" value.
 * TrustMRR docs say revenue.mrr is in USD cents, but some responses appear to
 * return dollars (e.g. 502 for $502). We treat values under 1000 as dollars
 * (convert to cents) and 1000+ as cents, so both 502 and 50200 display as $502.
 */
function normalizeMrrToCents(value: number): number {
  if (value >= 1000) return value; // already in cents (e.g. 50200, 180000)
  return Math.round(value * 100);   // assume dollars (e.g. 502 → 50200)
}

/** Convert USD cents to a human-readable dollar string, e.g. 180000 → "$1,800" */
export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format a growth percentage into a display string.
 * The API returns raw percentage values (e.g. 24 = 24% growth, -38.6 = -38.6%).
 * Returns "+24.0%" or "-38.6%" or "N/A" if null.
 */
export function formatGrowth(value: number | null): string {
  if (value === null || value === undefined) return "N/A";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/** Capitalise a payment provider slug, e.g. "stripe" → "Stripe" */
export function formatProvider(provider: string): string {
  const map: Record<string, string> = {
    stripe: "Stripe",
    lemonsqueezy: "LemonSqueezy",
    polar: "Polar",
    revenuecat: "RevenueCat",
    dodopayment: "DodoPayment",
  };
  return map[provider.toLowerCase()] ?? provider;
}
