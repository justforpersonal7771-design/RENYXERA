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
export type Plan = { id: PlanId; tier: Exclude<Tier, "free">; name: string; periodDays: number; periodLabel: string; pricePaise: number | null };

export const PLANS: Plan[] = [
  { id: "plus_monthly", tier: "plus", name: "Plus · Monthly", periodDays: 30, periodLabel: "per month", pricePaise: null },
  { id: "plus_yearly", tier: "plus", name: "Plus · Yearly", periodDays: 365, periodLabel: "per year", pricePaise: null },
  { id: "pro_monthly", tier: "pro", name: "Pro · Monthly", periodDays: 30, periodLabel: "per month", pricePaise: null },
  { id: "pro_yearly", tier: "pro", name: "Pro · Yearly", periodDays: 365, periodLabel: "per year", pricePaise: null },
];

export const planById = (id: string) => PLANS.find((p) => p.id === id) ?? null;
export const formatPrice = (paise: number | null) => (paise == null ? "Price coming soon" : `₹${(paise / 100).toLocaleString("en-IN")}`);

export const FREE_AI_DAILY = 30;
export const PLUS_AI_DAILY = 75;
export const PRO_AI_DAILY = 150;
export const AI_DAILY: Record<Tier, number> = { free: FREE_AI_DAILY, plus: PLUS_AI_DAILY, pro: PRO_AI_DAILY };

/** What each paid tier adds. Everything not listed stays free for everyone. */
export const TIER_FEATURES: Record<Exclude<Tier, "free">, { title: string; body: string }[]> = {
  plus: [
    { title: `${PLUS_AI_DAILY} AI requests a day`, body: `2.5× the free ${FREE_AI_DAILY}.` },
    { title: "6 Silver avatar styles", body: "Avataaar, Big Smile, Open Peeps, Persona, Pixel Art, Fun Emoji." },
    { title: "Silver crown & navbar", body: "A silver ring and crown on your avatar." },
  ],
  pro: [
    { title: `${PRO_AI_DAILY} AI requests a day`, body: `5× the free ${FREE_AI_DAILY}.` },
    { title: "All 20 avatar styles", body: "Every Silver style plus 6 Gold-only ones: Toon, Voxel, Clay and more." },
    { title: "AI Mentor exports & AI study planner", body: "Coming to Pro first." },
    { title: "Gold crown, gold navbar, priority fixes", body: "Your reported issues are looked at first." },
  ],
};

export const FREE_FOREVER = ["Every official PYQ since 2017", "Exam-like simulator & custom tests", "All-India mocks & leaderboards", "Analytics, mistakes bank & revision", "Cloud sync across devices", `${FREE_AI_DAILY} AI requests a day`];
