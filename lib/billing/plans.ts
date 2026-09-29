// Release 7A — the ONE place prices and plan contents live. Prices are deliberately unset
// (null) until the owner picks them; while any price is null the plan can only collect
// interest, never take money.
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

export type PlanId = "pro_monthly" | "pro_yearly";
export type Plan = { id: PlanId; name: string; periodDays: number; periodLabel: string; pricePaise: number | null; highlight?: boolean; note?: string };

export const PLANS: Plan[] = [
  { id: "pro_monthly", name: "Pro · Monthly", periodDays: 30, periodLabel: "per month", pricePaise: null },
  { id: "pro_yearly", name: "Pro · Yearly", periodDays: 365, periodLabel: "per year", pricePaise: null, highlight: true, note: "Best value for a full GATE season" },
];

export const planById = (id: string) => PLANS.find((p) => p.id === id) ?? null;
export const formatPrice = (paise: number | null) => (paise == null ? "Price coming soon" : `₹${(paise / 100).toLocaleString("en-IN")}`);

/** What Pro adds. Everything not listed here stays free for everyone. */
export const PRO_FEATURES = [
  { key: "ai_quota", title: "5× AI Mentor & Tutor requests", body: "150 AI requests a day instead of 30." },
  { key: "ai_exports", title: "AI Mentor exports", body: "Download your AI revision plans and notes." },
  { key: "ai_planner", title: "AI study planner", body: "A plan that re-balances itself from your mistakes every week." },
  { key: "priority", title: "Priority fixes", body: "Your reported issues are looked at first." },
] as const;

export const FREE_FOREVER = ["Every official PYQ since 2017", "Exam-like simulator & custom tests", "All-India mocks & leaderboards", "Analytics, mistakes bank & revision", "Cloud sync across devices", "30 AI requests a day"];

export const FREE_AI_DAILY = 30;
export const PRO_AI_DAILY = 150;
