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

export type PlanId = "plus_monthly" | "plus_yearly" | "pro_monthly" | "pro_yearly";
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

export const planById = (id: string) => PLANS.find((p) => p.id === id) ?? null;

/** Honest comparison price for a plan: a yearly plan vs 12 × its monthly price, else its
 *  genuine list price (if any). Returns the struck-through amount and the % saved. */
export function comparePrice(plan: Plan) {
  if (plan.pricePaise == null) return null;
  const monthly = PLANS.find((p) => p.tier === plan.tier && p.id.endsWith("monthly"));
  const ref = plan.periodDays >= 365 && monthly?.pricePaise != null ? monthly.pricePaise * 12 : plan.listPricePaise ?? null;
  if (!ref || ref <= plan.pricePaise) return null;
  return { wasPaise: ref, savePct: Math.round((1 - plan.pricePaise / ref) * 100), perMonthPaise: plan.periodDays >= 365 ? Math.round(plan.pricePaise / 12) : null, reason: plan.periodDays >= 365 ? "vs paying monthly" : "launch price" };
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
