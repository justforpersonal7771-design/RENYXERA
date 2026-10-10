// Release 7A — the ONE place tiers, prices and plan contents live. Three tiers:
//   Free · Plus (silver) · Pro (gold)
// Prices are deliberately unset (null) until the owner picks them; while a price is null the
// plan can only collect interest, never take money.
//
// Billing mode (NEXT_PUBLIC_BILLING_MODE):
//   "interest" (default) — fake door: "Upgrade" records interest, no checkout, no money.
//   "test"               — Razorpay test-mode checkout (test keys, fake cards/UPI).
//   "live"               — real payments. Only switch after prices are set here.

export type BillingMode = "interest" | "test" | "live";
export const BILLING_MODE: BillingMode = ((): BillingMode => {
  const m = process.env.NEXT_PUBLIC_BILLING_MODE;
  return m === "test" || m === "live" ? m : "interest";
})();

export type Tier = "free" | "plus" | "pro";
export const TIER_RANK: Record<Tier, number> = { free: 0, plus: 1, pro: 2 };
export const TIERS: { id: Tier; name: string; metal: string }[] = [
  { id: "free", name: "Free", metal: "" },
  { id: "plus", name: "Plus", metal: "Silver" },
  { id: "pro", name: "Pro", metal: "Gold" },
];

export type SeasonPlanId = `${"plus" | "pro"}_season_${number}`;
export type PlanId = "plus_monthly" | "plus_yearly" | "pro_monthly" | "pro_yearly" | SeasonPlanId;
// listPricePaise: an optional *genuine* regular price shown struck through (e.g. a launch
// offer before a real, planned increase). Leave null unless it's true — India's 2023 Dark
// Patterns Guidelines treat never-charged "was" prices as misleading. Yearly plans instead
// show the honest monthly-equivalent total they save against.
export type Plan = { id: PlanId; tier: Exclude<Tier, "free">; name: string; periodDays: number; periodLabel: string; pricePaise: number | null; listPricePaise?: number | null };

export const PLANS: Plan[] = [
  // Prices set by the owner 30 Sep 2026 (INR, inclusive). Payments stay off until BILLING_MODE changes.
  { id: "plus_monthly", tier: "plus", name: "Plus · Monthly", periodDays: 30, periodLabel: "per month", pricePaise: 2900, listPricePaise: null },
  { id: "plus_yearly", tier: "plus", name: "Plus · Yearly", periodDays: 365, periodLabel: "per year", pricePaise: 24900 },
  { id: "pro_monthly", tier: "pro", name: "Pro · Monthly", periodDays: 30, periodLabel: "per month", pricePaise: 9900, listPricePaise: null },
  { id: "pro_yearly", tier: "pro", name: "Pro · Yearly", periodDays: 365, periodLabel: "per year", pricePaise: 79900 },
];

// ── GATE season pass ─────────────────────────────────────────────────────────────────────────
// One payment that lasts until the end of the chosen exam season (31 March of that year, IST, after
// results). The price is computed from the TRUE time remaining (server clock), never sent by the client:
//   up to 12 months: ₹25 (Plus) / ₹83 (Pro) per month, capped at the yearly plan's price;
//   beyond 12 months: the yearly plan's per-month rate (₹20.75 / ₹66.58), and 10% off beyond 24 months.
// Prices end in 9. Existing monthly/yearly plans are unchanged. No lifetime offer, no free trial.
const SEASON_RATE = { plus: 2500, pro: 8300 } as const; // paise per month, short passes
export const seasonEndMs = (year: number) => Date.UTC(year, 2, 31, 18, 29, 59); // 23:59:59 IST on 31 March
export const upcomingSeasonYear = (nowMs: number) => { const y = new Date(nowMs).getUTCFullYear(); return nowMs > seasonEndMs(y) ? y + 1 : y; };
export const SEASON_MAX_YEARS_AHEAD = 4;
export const seasonYears = (nowMs: number) => Array.from({ length: SEASON_MAX_YEARS_AHEAD + 1 }, (_, i) => upcomingSeasonYear(nowMs) + i);
const endIn9 = (paise: number) => Math.max(9, Math.round((paise / 100 + 1) / 10) * 10 - 1) * 100;

export function seasonPlan(tier: "plus" | "pro", year: number, nowMs: number): Plan | null {
  const first = upcomingSeasonYear(nowMs);
  if (!Number.isInteger(year) || year < first || year > first + SEASON_MAX_YEARS_AHEAD) return null;
  const periodDays = Math.ceil((seasonEndMs(year) - nowMs) / 86400_000);
  if (periodDays < 1 || periodDays > 2200) return null;
  const months = Math.max(1, Math.ceil(periodDays / 30.4375));
  const yearly = PLANS.find((p) => p.id === `${tier}_yearly`)!.pricePaise!;
  const raw = months <= 12 ? Math.min(months * SEASON_RATE[tier], yearly) : (months * yearly / 12) * (months > 24 ? 0.9 : 1);
  return { id: `${tier}_season_${year}`, tier, name: `${tier === "pro" ? "Pro" : "Plus"} · GATE ${year} Pass`, periodDays, periodLabel: `until 31 Mar ${year}`, pricePaise: endIn9(raw) };
}

/** Looks up a fixed plan, or builds a season pass (price and length depend on `nowMs`, so pass the server clock). */
export function planById(id: string, nowMs: number = Date.now()): Plan | null {
  const fixed = PLANS.find((p) => p.id === id);
  if (fixed) return fixed;
  const m = /^(plus|pro)_season_(\d{4})$/.exec(id);
  return m ? seasonPlan(m[1] as "plus" | "pro", Number(m[2]), nowMs) : null;
}

/** Honest comparison price for a plan: a yearly plan vs 12 × its monthly price, else its
 *  genuine list price (if any). Returns the struck-through amount and the % saved. */
export function comparePrice(plan: Plan) {
  if (plan.pricePaise == null) return null;
  const monthly = PLANS.find((p) => p.tier === plan.tier && p.id.endsWith("monthly"));
  const season = plan.id.includes("_season_");
  const ref = season && monthly?.pricePaise != null ? monthly.pricePaise * Math.max(1, Math.ceil(plan.periodDays / 30.4375)) : plan.periodDays >= 365 && monthly?.pricePaise != null ? monthly.pricePaise * 12 : plan.listPricePaise ?? null;
  if (!ref || ref <= plan.pricePaise) return null;
  return { wasPaise: ref, savePct: Math.round((1 - plan.pricePaise / ref) * 100), perMonthPaise: plan.periodDays >= 365 ? Math.round(plan.pricePaise / 12) : null, reason: plan.periodDays >= 365 || season ? "vs paying monthly" : "launch price" };
}
export const formatPrice = (paise: number | null) => (paise == null ? "Price coming soon" : `₹${(paise / 100).toLocaleString("en-IN")}`);

/** Free has no daily AI allowance — a one-time teaser instead (FREE_AI_TEASER) + earned credits. */
export const FREE_AI_DAILY = 0;
export const FREE_AI_TEASER = 5;
export const PLUS_AI_DAILY = 75;
export const PRO_AI_DAILY = 150;
export const AI_DAILY: Record<Tier, number> = { free: FREE_AI_DAILY, plus: PLUS_AI_DAILY, pro: PRO_AI_DAILY };

/** What each paid tier adds. Everything not listed stays free for everyone. */
export const TIER_FEATURES: Record<Exclude<Tier, "free">, { title: string; body: string }[]> = {
  plus: [
    { title: `${PLUS_AI_DAILY} AI requests every day`, body: "AI Mentor & Tutor for daily doubts and revision." },
    { title: "Smart insights & daily adaptive path", body: "Personal insights and a focus topic chosen for you every day." },
    { title: "Exam trends & AI Insights revision", body: "Accuracy and score trend across tests; AI shortcut sheets in Revision." },
    { title: "6 Silver avatar styles", body: "Avataaar, Big Smile, Open Peeps, Persona, Pixel Art, Fun Emoji." },
    { title: "Silver crown & navbar", body: "A silver ring and crown on your avatar." },
  ],
  pro: [
    { title: `${PRO_AI_DAILY} AI requests every day`, body: "Twice Plus — for students who lean on the AI Mentor." },
    { title: "Deep analytics", body: "Detailed mock analytics, topic ladders and difficulty analysis." },
    { title: "Offline downloads", body: "Save whole papers and practise without internet." },
    { title: "All 20 avatar styles", body: "Every Silver style plus 6 Gold-only ones: Toon, Voxel, Clay and more." },
    { title: "Gold crown, gold navbar, priority fixes", body: "Your reported issues are looked at first." },
  ],
};

export const FREE_FOREVER = ["Every official PYQ in the bank for your paper (CS since 2017)", "Exam-like simulator & custom tests", "All-India mocks & leaderboards", "Analytics, mistakes bank & revision", "Cloud sync across devices", `${FREE_AI_TEASER} AI requests to try — earn more with sponsor breaks & referrals`];
